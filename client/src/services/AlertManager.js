/**
 * Centralized Alert Manager for Medicine and Appointment Reminders
 * Ensures alerts are shown ONCE per scheduled time across all pages
 * Persists state across navigation
 */

class AlertManager {
  constructor() {
    this.shownAlerts = new Map(); // Track alerts that have been shown
    this.alertCallbacks = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the alert manager
   */
  initialize() {
    if (this.isInitialized) return;
    
    // Load shown alerts from sessionStorage to survive page refreshes
    const saved = sessionStorage.getItem('meditrack_shown_alerts');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.shownAlerts = new Map(data);
      } catch (e) {
        console.error('Error loading alert history:', e);
      }
    }
    
    this.isInitialized = true;
    console.log('✅ AlertManager initialized');
  }

  /**
   * Register a callback to be notified of new alerts
   */
  subscribe(callback) {
    this.alertCallbacks.push(callback);
    return () => {
      this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Check if an alert has already been shown in this session
   */
  hasBeenShown(alertKey) {
    return this.shownAlerts.has(alertKey);
  }

  /**
   * Mark an alert as shown and set expiration
   */
  markAsShown(alertKey, expirationTime = 60000) {
    const expiryTimestamp = Date.now() + expirationTime;
    this.shownAlerts.set(alertKey, expiryTimestamp);
    this.persistToStorage();
    
    // Auto-clean after expiration
    setTimeout(() => {
      this.shownAlerts.delete(alertKey);
      this.persistToStorage();
    }, expirationTime);
  }

  /**
   * Persist shown alerts to session storage
   */
  persistToStorage() {
    try {
      const data = Array.from(this.shownAlerts.entries());
      sessionStorage.setItem('meditrack_shown_alerts', JSON.stringify(data));
    } catch (e) {
      console.error('Error persisting alerts:', e);
    }
  }

  /**
   * Process incoming alerts and filter out duplicates
   */
  processAlerts(newAlerts) {
    const uniqueAlerts = [];
    const now = Date.now();

    for (const alert of newAlerts) {
      const alertKey = alert.key || `${alert.type}_${alert.id || alert.medicineId || alert.appointmentId}`;
      
      // Clean up expired entries
      const expiry = this.shownAlerts.get(alertKey);
      if (expiry && expiry < now) {
        this.shownAlerts.delete(alertKey);
      }

      // Only include alerts that haven't been shown yet
      if (!this.shownAlerts.has(alertKey)) {
        uniqueAlerts.push({ ...alert, key: alertKey });
        this.markAsShown(alertKey);
      }
    }

    // Notify all subscribers
    if (uniqueAlerts.length > 0) {
      this.alertCallbacks.forEach(callback => callback(uniqueAlerts));
    }

    return uniqueAlerts;
  }

  /**
   * Clear all alerts (on logout)
   */
  clear() {
    this.shownAlerts.clear();
    sessionStorage.removeItem('meditrack_shown_alerts');
  }

  /**
   * Get all active alerts
   */
  getShowedAlerts() {
    const now = Date.now();
    const active = [];
    
    for (const [key, expiry] of this.shownAlerts.entries()) {
      if (expiry > now) {
        active.push(key);
      } else {
        this.shownAlerts.delete(key);
      }
    }
    
    return active;
  }
}

// Export singleton instance
export const alertManager = new AlertManager();

export default alertManager;
