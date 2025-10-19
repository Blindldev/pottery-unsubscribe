// Simple API handler for GitHub Pages
// This file handles unsubscribe requests when the main API is not available

class UnsubscribeAPI {
    constructor() {
        this.storageKey = 'pottery_unsubscribes';
        this.loadUnsubscribes();
    }

    loadUnsubscribes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.unsubscribes = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading unsubscribes:', error);
            this.unsubscribes = [];
        }
    }

    saveUnsubscribes() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.unsubscribes));
        } catch (error) {
            console.error('Error saving unsubscribes:', error);
        }
    }

    async addUnsubscribe(email, action, preferences = {}) {
        const record = {
            email: email.toLowerCase().trim(),
            action: action,
            timestamp: new Date().toISOString(),
            preferences: preferences,
            source: 'github-pages-local'
        };

        // Remove existing record for this email
        this.unsubscribes = this.unsubscribes.filter(u => u.email !== record.email);
        
        // Add new record
        this.unsubscribes.push(record);
        this.saveUnsubscribes();

        return { success: true, record: record };
    }

    async isUnsubscribed(email) {
        const record = this.unsubscribes.find(u => 
            u.email === email.toLowerCase().trim() && 
            (u.action === 'unsubscribe' || u.action === 'pause')
        );
        return !!record;
    }

    async getAllUnsubscribes() {
        return this.unsubscribes;
    }
}

// Initialize API
const unsubscribeAPI = new UnsubscribeAPI();

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Override the original functions to use local storage
    window.processUnsubscribe = async function() {
        if (!currentEmail) {
            showMessage('Please enter your email address first.', 'error');
            return;
        }

        try {
            const result = await unsubscribeAPI.addUnsubscribe(currentEmail, 'unsubscribe');
            
            if (result.success) {
                showMessage('You have been successfully unsubscribed from all emails.', 'success');
                document.querySelector('.options').style.display = 'none';
                document.querySelector('.action-buttons').style.display = 'none';
            } else {
                showMessage('Error: Failed to unsubscribe', 'error');
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
                showMessage('Your email preferences have been updated successfully!', 'success');
                document.querySelector('.options').style.display = 'none';
                document.querySelector('.action-buttons').style.display = 'none';
            } else {
                showMessage('Error: Failed to update preferences', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to process preferences update. Please try again later.', 'error');
        }
    };
});
