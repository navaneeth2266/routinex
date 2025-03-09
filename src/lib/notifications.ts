/**
 * Utility functions for handling notifications in the PWA
 */

// Check if notifications are supported and permission is granted
export const checkNotificationsSupport = (): { supported: boolean; permissionGranted: boolean } => {
  const supported = 'Notification' in window
  const permissionGranted = supported && Notification.permission === 'granted'
  
  return { supported, permissionGranted }
}

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Schedule a reminder notification
export const scheduleNotification = async (reminderTime: string): Promise<boolean> => {
  const { supported, permissionGranted } = checkNotificationsSupport()
  
  if (!supported) {
    console.error('Notifications are not supported in this browser')
    return false
  }
  
  if (!permissionGranted) {
    const granted = await requestNotificationPermission()
    if (!granted) {
      console.error('Notification permission denied')
      return false
    }
  }

  // Clear any existing scheduled notifications (if any)
  clearScheduledNotification()
  
  // Calculate time until the reminder should trigger
  const [hours, minutes] = reminderTime.split(':').map(Number)
  const now = new Date()
  const scheduledTime = new Date(now)
  scheduledTime.setHours(hours, minutes, 0, 0)
  
  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }
  
  const timeUntilReminder = scheduledTime.getTime() - now.getTime()
  
  // Schedule the notification
  const timerId = setTimeout(() => {
    showNotification()
    // Re-schedule for the next day after showing notification
    scheduleNotification(reminderTime)
  }, timeUntilReminder)
  
  // Store the timer ID so we can clear it later if needed
  localStorage.setItem('habitReminderTimerId', timerId.toString())
  localStorage.setItem('habitReminderTime', reminderTime)
  
  return true
}

// Show a notification
export const showNotification = () => {
  if (!('Notification' in window)) {
    return
  }
  
  // Get the list of habits from localStorage
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  const incompleteHabits = habits.filter((habit: any) => {
    const today = new Date().toISOString().split('T')[0]
    return !habit.completedDates.includes(today)
  })
  
  let notificationText = 'Time to complete your habits for today!'
  if (incompleteHabits.length > 0) {
    if (incompleteHabits.length === 1) {
      notificationText = `Don't forget to complete "${incompleteHabits[0].name}" today!`
    } else {
      notificationText = `You have ${incompleteHabits.length} habits to complete today!`
    }
  }
  
  const notification = new Notification('RoutineX Reminder', {
    body: notificationText,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  })
  
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

// Clear any scheduled notifications
export const clearScheduledNotification = () => {
  const timerId = localStorage.getItem('habitReminderTimerId')
  if (timerId) {
    clearTimeout(parseInt(timerId, 10))
    localStorage.removeItem('habitReminderTimerId')
  }
}

// Initialize notifications on app load
export const initializeNotifications = () => {
  const reminderEnabled = localStorage.getItem('habitSettings') 
    ? JSON.parse(localStorage.getItem('habitSettings') || '{}').reminderEnabled 
    : false
  
  if (reminderEnabled) {
    const reminderTime = localStorage.getItem('habitSettings') 
      ? JSON.parse(localStorage.getItem('habitSettings') || '{}').reminderTime 
      : '20:00'
    
    scheduleNotification(reminderTime)
  }
} 