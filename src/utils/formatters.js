export function formatRelativeTime(value) {
  if (!value) {
    return 'No activity yet'
  }

  const date = new Date(value)
  const diff = Date.now() - date.getTime()

  if (Number.isNaN(date.getTime())) {
    return 'No activity yet'
  }

  const minutes = Math.floor(diff / 60_000)

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function getLeadInitials(name) {
  if (!name) {
    return 'LD'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatChannel(channel) {
  if (!channel) {
    return 'Unknown'
  }

  return channel === 'linkedin' ? 'LinkedIn' : 'Email'
}

export function formatTime(value) {
  if (!value) {
    return '--:--'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatMeetingDate(value) {
  if (!value) {
    return 'Date pending'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Date pending'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function safeParseSummary(summary) {
  if (!summary) {
    return null
  }

  if (typeof summary === 'object') {
    return summary
  }

  try {
    return JSON.parse(summary)
  } catch {
    return {
      outcome: summary,
      objections_raised: [],
      lead_tone: 'Unknown',
      recommendation: 'Review manually',
      total_messages: 0,
    }
  }
}
