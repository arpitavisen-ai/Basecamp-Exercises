import { ref } from 'vue'

// Singleton — persists across navigation within the session
const restockingOrders = ref([])

export function useRestockingOrders() {
  const addRestockingOrder = (order) => {
    restockingOrders.value.unshift(order)
  }

  return {
    restockingOrders,
    addRestockingOrder,
  }
}
