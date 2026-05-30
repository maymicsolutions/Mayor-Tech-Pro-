// assets/js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';
import { firebaseConfig } from '../../firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log('🔥 Firebase initialized successfully!');

// Get the contact form
const contactForm = document.getElementById('firebase-contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const statusDiv = document.getElementById('form-status');
    
    // Validation
    if (!name || !email || !message) {
      statusDiv.innerHTML = '⚠️ Please fill in all fields.';
      statusDiv.style.color = '#ff6b6b';
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusDiv.innerHTML = '⚠️ Please enter a valid email address.';
      statusDiv.style.color = '#ff6b6b';
      return;
    }
    
    // Disable button and show loading
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    statusDiv.innerHTML = '';
    
    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'contacts'), {
        name: name,
        email: email,
        message: message,
        timestamp: serverTimestamp(),
        read: false
      });
      
      console.log('Message saved with ID:', docRef.id);
      
      // Success message
      statusDiv.innerHTML = '✅ Message sent successfully! I\'ll get back to you soon.';
      statusDiv.style.color = '#00E0FF';
      contactForm.reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        statusDiv.innerHTML = '';
      }, 5000);
      
    } catch (error) {
      console.error('Firebase Error:', error);
      statusDiv.innerHTML = '❌ Failed to send message. Please try again.';
      statusDiv.style.color = '#ff6b6b';
    } finally {
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}