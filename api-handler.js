// Secure API handler for GitHub Pages
// This file handles unsubscribe requests via secure AWS-backed API

class SecureUnsubscribeAPI {
    constructor() {
        this.apiUrl = 'https://pottery-unsubscribe.mixedchicago.workers.dev'; // Cloudflare Worker URL
        this.fallbackStorageKey = 'pottery_unsubscribes_fallback';
    }

    async addUnsubscribe(email, action, preferences = {}) {
        try {
            // Try secure API first
            const response = await fetch(`${this.apiUrl}/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    action: action,
                    preferences: preferences,
                    ip: await this.getClientIP(),
                    userAgent: navigator.userAgent
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Also store locally as backup
                this.storeLocally(email, action, preferences);
                return { success: true, message: data.message };
            } else {
                throw new Error(data.message || 'API request failed');
            }
        } catch (error) {
            console.warn('Secure API failed, using local fallback:', error);
            // Fallback to local storage
            return this.addUnsubscribeLocal(email, action, preferences);
        }
    }

    async addUnsubscribeLocal(email, action, preferences = {}) {
        const record = {
            email: email.toLowerCase().trim(),
            action: action,
            timestamp: new Date().toISOString(),
            preferences: preferences,
            source: 'github-pages-fallback'
        };

        try {
            const stored = localStorage.getItem(this.fallbackStorageKey);
            const unsubscribes = stored ? JSON.parse(stored) : [];
            
            // Remove existing record for this email
            const filtered = unsubscribes.filter(u => u.email !== record.email);
            
            // Add new record
            filtered.push(record);
            localStorage.setItem(this.fallbackStorageKey, JSON.stringify(filtered));

            return { success: true, message: 'Request processed (offline mode)' };
        } catch (error) {
            console.error('Error in local fallback:', error);
            return { success: false, message: 'Failed to process request' };
        }
    }

    storeLocally(email, action, preferences) {
        try {
            const record = {
                email: email.toLowerCase().trim(),
                action: action,
                timestamp: new Date().toISOString(),
                preferences: preferences,
                source: 'github-pages-secure'
            };

            const stored = localStorage.getItem(this.fallbackStorageKey);
            const unsubscribes = stored ? JSON.parse(stored) : [];
            
            // Remove existing record for this email
            const filtered = unsubscribes.filter(u => u.email !== record.email);
            
            // Add new record
            filtered.push(record);
            localStorage.setItem(this.fallbackStorageKey, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error storing locally:', error);
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    async isUnsubscribed(email) {
        try {
            // Try secure API first
            const response = await fetch(`${this.apiUrl}/unsubscribe/check/${encodeURIComponent(email)}`);
            const data = await response.json();
            return data.isUnsubscribed || false;
        } catch (error) {
            console.warn('Secure API check failed, using local fallback:', error);
            // Fallback to local storage
            return this.isUnsubscribedLocal(email);
        }
    }

    isUnsubscribedLocal(email) {
        try {
            const stored = localStorage.getItem(this.fallbackStorageKey);
            if (!stored) return false;
            
            const unsubscribes = JSON.parse(stored);
            const record = unsubscribes.find(u => 
                u.email === email.toLowerCase().trim() && 
                (u.action === 'unsubscribe' || u.action === 'pause')
            );
            return !!record;
        } catch (error) {
            console.error('Error checking local unsubscribe status:', error);
            return false;
        }
    }
}

// Initialize API
const unsubscribeAPI = new SecureUnsubscribeAPI();

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Override the original functions to use secure API
    window.processUnsubscribe = async function() {
        if (!currentEmail) {
            showMessage('Please enter your email address first.', 'error');
            return;
        }

        try {
            const result = await unsubscribeAPI.addUnsubscribe(currentEmail, 'unsubscribe');
            
            if (result.success) {
                showMessage(result.message || 'You have been successfully unsubscribed from all emails.', 'success');
                document.querySelector('.options').style.display = 'none';
                document.querySelector('.action-buttons').style.display = 'none';
            } else {
                showMessage('Error: ' + (result.message || 'Failed to unsubscribe'), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to process unsubscribe request. Please try again later.', 'error');
        }
    };

    window.processPreferences = async function() {
        const preferences = {
            newsletter: document.getElementById('newsletter').checked,
            promotions: document.getElementById('promotions').checked,
            events: document.getElementById('events').checked
        };

        try {
            const result = await unsubscribeAPI.addUnsubscribe(currentEmail, 'preferences', preferences);
            
            if (result.success) {
                showMessage(result.message || 'Your email preferences have been updated successfully!', 'success');
                document.querySelector('.options').style.display = 'none';
                document.querySelector('.action-buttons').style.display = 'none';
            } else {
                showMessage('Error: ' + (result.message || 'Failed to update preferences'), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to process preferences update. Please try again later.', 'error');
        }
    };
});
