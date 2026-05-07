<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Planner</h2>
      <p>Set your available budget and order items that need restocking. Items are sorted cheapest first to maximise units within your budget.</p>
    </div>

    <div v-if="loading" class="loading">Loading inventory...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>

      <!-- Budget Control -->
      <div class="card budget-card">
        <div class="budget-header">
          <div>
            <h3 class="card-title">Available Budget</h3>
            <p class="budget-hint">Drag to set your restocking budget</p>
          </div>
          <div class="budget-amount">${{ budget.toLocaleString() }}</div>
        </div>

        <div class="slider-wrap">
          <input
            type="range"
            class="budget-slider"
            :min="1000"
            :max="100000"
            :step="1000"
            v-model.number="budget"
          />
          <div class="slider-labels">
            <span>$1,000</span>
            <span>$100,000</span>
          </div>
        </div>

        <div class="budget-bar-section">
          <div class="budget-bar-track">
            <div
              class="budget-bar-fill"
              :class="{ over: budgetUsed > budget }"
              :style="{ width: Math.min(100, (budgetUsed / budget) * 100) + '%' }"
            ></div>
          </div>
          <div class="budget-bar-labels">
            <span :class="{ 'text-danger': budgetUsed > budget }">
              ${{ budgetUsed.toLocaleString(undefined, { maximumFractionDigits: 2 }) }} used
            </span>
            <span :class="{ 'text-danger': budgetUsed > budget }">
              {{ budgetUsed > budget
                ? '$' + (budgetUsed - budget).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' over budget'
                : '$' + (budget - budgetUsed).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' remaining'
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recommendations Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Recommended Items ({{ recommendations.length }})</h3>
            <p class="card-subtitle">Sorted by unit cost — cheapest first to stretch your budget</p>
          </div>
        </div>

        <div v-if="recommendations.length === 0" class="empty-state">
          All inventory levels are healthy. No restocking needed at this time.
        </div>

        <div v-else class="table-container">
          <table class="restock-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Stock Status</th>
                <th>Unit Cost</th>
                <th>Qty to Order</th>
                <th>Subtotal</th>
                <th>Budget Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.id"
                :class="{ 'row-over-budget': isOverBudgetItem(item), 'row-zero-qty': item.orderQty === 0 }"
              >
                <td>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-sku">{{ item.sku }}</div>
                </td>
                <td>{{ item.category }}</td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <span :class="['badge', stockClass(item)]">{{ stockLabel(item) }}</span>
                  <div class="stock-numbers">{{ item.quantity_on_hand }} on hand / {{ item.reorder_point }} min</div>
                </td>
                <td class="col-cost">${{ item.unit_cost.toFixed(2) }}</td>
                <td>
                  <input
                    type="number"
                    class="qty-input"
                    min="0"
                    max="9999"
                    v-model.number="item.orderQty"
                    @change="clampQty(item)"
                  />
                </td>
                <td class="col-cost">
                  <span :class="{ muted: item.orderQty === 0 }">
                    ${{ (item.orderQty * item.unit_cost).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
                  </span>
                </td>
                <td>
                  <span v-if="item.orderQty === 0" class="badge neutral">Skipped</span>
                  <span v-else-if="isOverBudgetItem(item)" class="badge danger">Over budget</span>
                  <span v-else class="badge success">In budget</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="5" class="total-label">Order Total</td>
                <td class="total-qty">{{ totalUnits }} units</td>
                <td class="total-cost" :class="{ 'text-danger': budgetUsed > budget }">
                  ${{ budgetUsed.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="order-footer">
          <div class="order-summary">
            <span>{{ selectedCount }} item{{ selectedCount !== 1 ? 's' : '' }} selected</span>
            <span class="sep">·</span>
            <span>{{ totalUnits }} units</span>
            <span class="sep">·</span>
            <span :class="{ 'text-danger': budgetUsed > budget }">
              ${{ budgetUsed.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
            </span>
          </div>
          <button
            class="btn-place-order"
            :disabled="selectedCount === 0 || submitting || budgetUsed > budget"
            @click="placeOrder"
          >
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="orderSuccess" class="alert alert-success">
        Order <strong>{{ orderSuccess.order_number }}</strong> placed.
        Expected delivery: {{ formatDate(orderSuccess.expected_delivery) }}.
        <router-link to="/orders">View in Orders tab</router-link>
      </div>
      <div v-if="orderError" class="alert alert-error">{{ orderError }}</div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'
import { useRestockingOrders } from '../composables/useRestockingOrders'

export default {
  name: 'Restocking',
  setup() {
    const { addRestockingOrder } = useRestockingOrders()

    const loading = ref(true)
    const error = ref(null)
    const budget = ref(10000)
    const recommendations = ref([])
    const submitting = ref(false)
    const orderSuccess = ref(null)
    const orderError = ref(null)

    // Running cost across all items (order maintained by unit_cost sort)
    const budgetUsed = computed(() =>
      recommendations.value.reduce((sum, item) => sum + item.orderQty * item.unit_cost, 0)
    )

    const selectedCount = computed(() =>
      recommendations.value.filter(item => item.orderQty > 0).length
    )

    const totalUnits = computed(() =>
      recommendations.value.reduce((sum, item) => sum + item.orderQty, 0)
    )

    // Mark an item as "over budget" if adding its subtotal pushes the running total past budget
    const isOverBudgetItem = (item) => {
      if (item.orderQty === 0) return false
      let running = 0
      for (const r of recommendations.value) {
        running += r.orderQty * r.unit_cost
        if (r.id === item.id) break
      }
      return running > budget.value
    }

    const stockClass = (item) => {
      if (item.quantity_on_hand <= item.reorder_point) return 'danger'
      return 'warning'
    }

    const stockLabel = (item) => {
      if (item.quantity_on_hand <= item.reorder_point) return 'Low Stock'
      return 'Approaching'
    }

    const clampQty = (item) => {
      if (!item.orderQty || item.orderQty < 0) item.orderQty = 0
      if (item.orderQty > 9999) item.orderQty = 9999
    }

    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

    const loadInventory = async () => {
      try {
        loading.value = true
        error.value = null
        const items = await api.getInventory()

        // Items at or approaching their reorder point
        const needsRestock = items.filter(item =>
          item.quantity_on_hand <= item.reorder_point * 1.5
        )

        // Cheapest first — maximises units within budget
        needsRestock.sort((a, b) => a.unit_cost - b.unit_cost)

        recommendations.value = needsRestock.map(item => ({
          ...item,
          // Suggest enough to bring stock to 2× reorder_point
          orderQty: Math.max(1, Math.round(item.reorder_point * 2 - item.quantity_on_hand)),
        }))
      } catch (err) {
        error.value = 'Failed to load inventory: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const placeOrder = async () => {
      const selected = recommendations.value.filter(item => item.orderQty > 0)
      if (selected.length === 0) return

      submitting.value = true
      orderSuccess.value = null
      orderError.value = null

      try {
        const warehouses = [...new Set(selected.map(i => i.warehouse))]
        const newOrder = await api.createOrder({
          customer: 'Factory Restocking',
          warehouse: warehouses.length === 1 ? warehouses[0] : null,
          items: selected.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.orderQty,
            unit_price: item.unit_cost,
            category: item.category,
          })),
        })

        addRestockingOrder(newOrder)
        orderSuccess.value = newOrder

        // Reset quantities after successful order
        recommendations.value.forEach(item => { item.orderQty = 0 })
      } catch (err) {
        orderError.value = 'Failed to place order: ' + err.message
      } finally {
        submitting.value = false
      }
    }

    onMounted(loadInventory)

    return {
      loading, error, budget, recommendations,
      submitting, orderSuccess, orderError,
      budgetUsed, selectedCount, totalUnits,
      isOverBudgetItem, stockClass, stockLabel,
      clampQty, formatDate, placeOrder,
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.9rem;
}

/* ── Budget Card ── */
.budget-card {
  margin-bottom: 1.5rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.budget-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.2rem;
}

.budget-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.slider-wrap {
  margin-bottom: 1rem;
}

.budget-slider {
  width: 100%;
  height: 6px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.3rem;
}

.budget-bar-section {
  margin-top: 0.5rem;
}

.budget-bar-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.budget-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.2s ease;
}

.budget-bar-fill.over {
  background: #ef4444;
}

.budget-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.4rem;
}

/* ── Card ── */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.2rem;
}

/* ── Table ── */
.table-container {
  overflow-x: auto;
}

.restock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restock-table th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.restock-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.restock-table tbody tr:last-child td {
  border-bottom: none;
}

.row-over-budget {
  opacity: 0.55;
}

.row-zero-qty {
  opacity: 0.4;
}

.item-name {
  font-weight: 500;
  color: #0f172a;
}

.item-sku {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: monospace;
  margin-top: 1px;
}

.stock-numbers {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 3px;
}

.col-cost {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.muted {
  color: #cbd5e1;
}

.qty-input {
  width: 72px;
  padding: 0.3rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: right;
  color: #0f172a;
}

.qty-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

/* ── Tfoot ── */
.total-row td {
  padding: 0.75rem;
  border-top: 2px solid #e2e8f0;
  font-weight: 600;
  color: #0f172a;
  border-bottom: none !important;
}

.total-label { color: #64748b; font-weight: 500; }
.total-qty, .total-cost { font-variant-numeric: tabular-nums; }

/* ── Order Footer ── */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
  gap: 1rem;
}

.order-summary {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sep { color: #cbd5e1; }

.btn-place-order {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-place-order:hover:not(:disabled) {
  background: #2563eb;
}

.btn-place-order:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* ── Badges ── */
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
}

.badge.success { background: #dcfce7; color: #166534; }
.badge.warning { background: #fef9c3; color: #854d0e; }
.badge.danger  { background: #fee2e2; color: #991b1b; }
.badge.neutral { background: #f1f5f9; color: #64748b; }

/* ── Text colours ── */
.text-danger { color: #ef4444; }

/* ── Alerts ── */
.alert {
  border-radius: 8px;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-success a {
  color: #15803d;
  font-weight: 600;
  text-decoration: underline;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* ── Empty / loading ── */
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.loading { padding: 2rem; color: #64748b; }
.error   { padding: 1rem; color: #ef4444; }
</style>
