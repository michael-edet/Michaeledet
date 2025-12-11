// Vertical Expandable Projects Functionality
function toggleVerticalItem(projectId) {
  const item = document.getElementById(`project-${projectId}`);
  const allItems = document.querySelectorAll('.featured-vertical-item');
  const content = item.querySelector('.vertical-item-content');
  
  // Close all other items
  allItems.forEach(otherItem => {
    if (otherItem !== item && otherItem.classList.contains('active')) {
      otherItem.classList.remove('active');
      const otherContent = otherItem.querySelector('.vertical-item-content');
      otherContent.style.maxHeight = '0';
    }
  });
  
  // Toggle current item
  if (item.classList.contains('active')) {
    item.classList.remove('active');
    content.style.maxHeight = '0';
  } else {
    item.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Smooth scroll to the expanded item
    setTimeout(() => {
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  }
}

function closeVerticalItem(projectId) {
  const item = document.getElementById(`project-${projectId}`);
  const content = item.querySelector('.vertical-item-content');
  
  item.classList.remove('active');
  content.style.maxHeight = '0';
}

// Initialize all projects to be collapsed
document.addEventListener('DOMContentLoaded', function() {
  const verticalItems = document.querySelectorAll('.featured-vertical-item');
  verticalItems.forEach(item => {
    const content = item.querySelector('.vertical-item-content');
    content.style.maxHeight = '0';
  });
  
  // Optional: Open first project by default
  // toggleVerticalItem('colony-core');
});