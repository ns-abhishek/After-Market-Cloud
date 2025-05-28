// Script to check if all required scripts are loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Checking if scripts are loaded:');
  
  // Check recipient-selection.js
  if (typeof initRecipientSelection === 'function') {
    console.log('✅ recipient-selection.js is loaded');
  } else {
    console.error('❌ recipient-selection.js is NOT loaded or has errors');
  }
  
  // Check language-selection.js
  if (typeof initLanguageSelection === 'function') {
    console.log('✅ language-selection.js is loaded');
  } else {
    console.error('❌ language-selection.js is NOT loaded or has errors');
  }
  
  // Check Quill editor
  if (typeof Quill === 'function') {
    console.log('✅ Quill.js is loaded');
  } else {
    console.error('❌ Quill.js is NOT loaded or has errors');
  }
  
  // Check DOM elements
  console.log('Checking DOM elements:');
  
  const recipientFilterOptions = document.getElementById('recipientFilterOptions');
  if (recipientFilterOptions) {
    console.log('✅ recipientFilterOptions element exists');
    console.log('Content:', recipientFilterOptions.innerHTML);
  } else {
    console.error('❌ recipientFilterOptions element does NOT exist');
  }
  
  const recipientList = document.getElementById('recipientList');
  if (recipientList) {
    console.log('✅ recipientList element exists');
    console.log('Content:', recipientList.innerHTML);
  } else {
    console.error('❌ recipientList element does NOT exist');
  }
});
