const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export const isApiConfigured = Boolean(apiBaseUrl)

async function apiRequest(path) {
  if (!isApiConfigured) {
    throw new Error('Missing VITE_API_BASE_URL')
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const data = await response.json()
      if (data?.detail) {
        message = Array.isArray(data.detail) ? data.detail.join(', ') : data.detail
      }
    } catch {
      // Ignore body parse errors and use the generic status message.
    }

    throw new Error(message)
  }

  return response.json()
}

export function getHealth() {
  return apiRequest('/health')
}

export function getLeads(stage = 'all') {
  const query = stage && stage !== 'all' ? `?stage=${encodeURIComponent(stage)}` : ''
  return apiRequest(`/leads${query}`)
}

export function getConversation(leadId) {
  return apiRequest(`/conversations/${leadId}`)
}

export function getLead(leadId) {
  return apiRequest(`/leads/${leadId}`)
}

export function getMetrics() {
  return apiRequest('/metrics/dashboard')
}

export async function launchOutbound(payload) {
  if (!isApiConfigured) {
    throw new Error('Missing VITE_API_BASE_URL')
  }

  const response = await fetch(`${apiBaseUrl}/outbound/launch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const data = await response.json()
      if (data?.detail) {
        message = Array.isArray(data.detail) ? data.detail.join(', ') : data.detail
      }
    } catch {
      // Ignore body parse errors and use the generic status message.
    }

    throw new Error(message)
  }

  return response.json()
}
