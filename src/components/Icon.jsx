const iconMap = {
  pipeline: 'account_tree',
  conversations: 'forum',
  metrics: 'bar_chart',
  search: 'search',
  sparkles: 'auto_awesome',
  notifications: 'notifications',
  settings: 'settings',
  help: 'help',
  speed: 'speed',
  hub: 'hub',
  forecast: 'query_stats',
  trend: 'auto_graph',
  chevronLeft: 'chevron_left',
  chevronRight: 'chevron_right',
  analytics: 'analytics',
  calendar: 'calendar_today',
  download: 'download',
  groups: 'groups',
  replies: 'quickreply',
  meetings: 'event_available',
  funnel: 'filter_alt',
  calendarMonth: 'calendar_month',
  bolt: 'bolt',
  arrowUp: 'arrow_upward',
  arrowDown: 'arrow_downward',
  addCircle: 'add_circle',
  send: 'send',
  mail: 'mail',
  link: 'link',
}

export default function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {iconMap[name] ?? name}
    </span>
  )
}
