'use client'

import { useEffect, useState, useCallback } from 'react'

interface Notification {
  id: string
  type: 'order' | 'payment' | 'review' | 'system'
  title: string
  message: string
  createdAt: string
  read: boolean
}

export function useNotifications(isAdmin = false) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  // Polling for new notifications every 30 seconds
  useEffect(() => {
    if (!isAdmin) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?since=${lastCheck.toISOString()}`)
        if (res.ok) {
          const data = await res.json()
          if (data.notifications?.length > 0) {
            setNotifications(prev => [...data.notifications, ...prev])
            setUnreadCount(prev => prev + data.notifications.length)
          }
          setLastCheck(new Date())
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    // Initial fetch
    fetchNotifications()

    // Set up polling
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [isAdmin, lastCheck])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  }
}
