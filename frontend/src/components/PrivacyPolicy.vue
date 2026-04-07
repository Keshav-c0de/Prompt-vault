<script setup lang="ts"></script>
<template><div class="max-w-4xl mx-auto p-6 md:p-10 text-gray-200 leading-relaxed antialiased">
  <h1 class="text-4xl font-extrabold mb-5 tracking-tight">Privacy Policy for AI Prompt Vault</h1>
  <p class="text-sm font-medium text-gray-200 mb-8"><strong>Effective Date:</strong> April 7, 2026</p>

  <p class="mb-8">Welcome to AI Prompt Vault. We are committed to protecting your privacy and ensuring your data is handled securely. This Privacy Policy explains how our browser extension collects, uses, and protects your information.</p>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">1. Information We Collect</h2>
  <p class="mb-5">To provide our core functionality, the AI Prompt Vault extension processes the following data:</p>
  <ul class="list-disc pl-8 space-y-3 mb-8">
    <li><strong class="font-medium text-gray-200">Authentication Tokens:</strong> When you log in via our official website, the extension securely receives and stores a session token (JWT) to keep you authenticated.</li>
    <li><strong class="font-medium text-gray-200">User Prompts:</strong> The extension fetches your personalized AI prompts from your vault via our secure API so they can be displayed and copied to your clipboard.</li>
  </ul>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">2. How We Use Your Information</h2>
  <p class="mb-5">We use your information <strong class="font-medium text-gray-200">strictly to provide the features of the extension</strong>.</p>
  <ul class="list-disc pl-8 space-y-3 mb-5">
    <li>Your authentication token is used solely to verify your identity with our backend API.</li>
    <li>Your prompts are retrieved solely to display them within the extension interface for your personal use.</li>
  </ul>
  <p class="mb-8 font-semibold p-4 border border-gray-200  rounded-lg">
    Crucial Commitment: We do not sell, rent, or share your personal data with third parties. We do not track your browsing history, and we do not use your data for targeted advertising.
  </p>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">3. Data Storage and Security</h2>
  <ul class="list-disc pl-8 space-y-3 mb-8">
    <li><strong class="font-medium text-gray-200">Local Storage:</strong> Your authentication token and cached prompts are stored locally on your device using the browser's secure extension storage API (<code>chrome.storage.local</code>).</li>
    <li><strong class="font-medium text-gray-200">Secure Transmission:</strong> All communication between the extension and our backend servers occurs over secure, encrypted HTTPS connections.</li>
  </ul>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">4. User Rights and Data Deletion</h2>
  <p class="mb-5">You have full control over your data within the extension:</p>
  <ul class="list-disc pl-8 space-y-3 mb-8">
    <li><strong class="font-medium text-gray-200">Logout:</strong> Logging out of the extension will immediately clear your authentication token from local storage.</li>
    <li><strong class="font-medium text-gray-200">Uninstall:</strong> Uninstalling the AI Prompt Vault extension from your browser will automatically delete all locally stored data associated with it.</li>
  </ul>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">5. Changes to This Policy</h2>
  <p class="mb-8">We may update this Privacy Policy occasionally to reflect changes in our practices or legal requirements. We encourage you to review this page periodically.</p>

  <h2 class="text-2xl font-semibold mt-10 mb-5 border-b pb-2">6. Contact Us</h2>
  <p class="mb-5">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <a href="mailto:support@prompt-vault.dev" class="font-semibold text-gray-200 hover:text-shadow-indigo-300">keshavbhardwaj9041@gmail.com</a></p>
</div></template>