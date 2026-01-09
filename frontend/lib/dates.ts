export const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const today = new Date()
    const yesterday = new Date()
  
    yesterday.setDate(today.getDate() - 1)
  
    if (date.toDateString() === today.toDateString()) return "Aujourd’hui"
    if (date.toDateString() === yesterday.toDateString()) return "Hier"
  
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }