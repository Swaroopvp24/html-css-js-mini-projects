// Enhanced Blog Application
class EnhancedBlog {
  constructor() {
    this.posts = [];
    this.categories = ["All", "Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Education", "Entertainment"];
    this.currentFilter = "All";
    this.searchTerm = "";
    this.sortBy = "newest";
    this.editingPost = null;
    this.confirmCallback = null;
    
    // Sample data
    this.samplePosts = [
      {
        id: 1,
        title: "Getting Started with Modern Web Development",
        content: "Web development has evolved significantly over the years. Today's developers have access to powerful frameworks, tools, and best practices that make building applications faster and more enjoyable.",
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
        dateCreated: "2024-01-15T10:30:00.000Z",
        readTime: 5
      },
      {
        id: 2,
        title: "10 Tips for a Productive Morning Routine",
        content: "Starting your day right can significantly impact your productivity and overall well-being. Here are ten practical tips to create a morning routine that sets you up for success.",
        category: "Lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
        dateCreated: "2024-01-12T08:15:00.000Z",
        readTime: 8
      },
      {
        id: 3,
        title: "Exploring the Hidden Gems of Tokyo",
        content: "Tokyo is a city of contrasts, where ancient traditions meet cutting-edge technology. Beyond the well-known tourist spots, there are countless hidden gems waiting to be discovered.",
        category: "Travel",
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
        dateCreated: "2024-01-10T14:22:00.000Z",
        readTime: 12
      }
    ];
    
    this.init();
  }
  
  init() {
    // Ensure all modals are hidden first
    this.hideAllModals();
    
    this.loadPosts();
    this.setupEventListeners();
    this.initializeTheme();
    this.render();
  }
  
  hideAllModals() {
    const modals = ['postModal', 'postDetailModal', 'confirmModal', 'notification'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
      }
    });
    document.body.style.overflow = 'auto';
  }
  
  // Data Management
  loadPosts() {
    const savedPosts = localStorage.getItem('enhancedBlogPosts');
    if (savedPosts) {
      try {
        this.posts = JSON.parse(savedPosts);
      } catch (error) {
        console.error('Error loading saved posts:', error);
        this.posts = [...this.samplePosts];
        this.savePosts();
      }
    } else {
      this.posts = [...this.samplePosts];
      this.savePosts();
    }
  }
  
  savePosts() {
    try {
      localStorage.setItem('enhancedBlogPosts', JSON.stringify(this.posts));
    } catch (error) {
      console.error('Error saving posts:', error);
      this.showNotification('Error saving posts to storage', 'error');
    }
  }
  
  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem('enhancedBlogTheme') || 'light';
    this.setTheme(savedTheme);
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('enhancedBlogTheme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  // Event Listeners
  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.render();
    });
    
    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.render();
    });
    
    // Create post button
    document.getElementById('createPostBtn').addEventListener('click', () => {
      this.openPostModal();
    });
    
    // Modal events
    this.setupModalEvents();
    
    // Form events
    this.setupFormEvents();
    
    // Data management events
    this.setupDataEvents();
  }
  
  setupModalEvents() {
    // Post modal
    const postModal = document.getElementById('postModal');
    const closeModal = document.getElementById('closeModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const cancelBtn = document.getElementById('cancelBtn');
    
    [closeModal, modalBackdrop, cancelBtn].forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closePostModal();
      });
    });
    
    // Detail modal
    const detailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailModalBackdrop = document.getElementById('detailModalBackdrop');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    
    [closeDetailModal, detailModalBackdrop, closeDetailBtn].forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeDetailModal();
      });
    });
    
    // Edit and delete buttons
    document.getElementById('editPostBtn').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.editingPost) {
        this.closeDetailModal();
        this.openPostModal(this.editingPost);
      }
    });
    
    document.getElementById('deletePostBtn').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.editingPost) {
        this.confirmDelete(this.editingPost.id);
      }
    });
    
    // Confirmation modal
    this.setupConfirmModal();
    
    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }
  
  setupFormEvents() {
    const postForm = document.getElementById('postForm');
    const postImage = document.getElementById('postImage');
    const postContent = document.getElementById('postContent');
    
    // Form submission
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
    
    // Image preview
    postImage.addEventListener('input', () => {
      this.updateImagePreview();
    });
    
    // Content word count and reading time
    postContent.addEventListener('input', () => {
      this.updateWordCount();
    });
    
    // Real-time validation
    this.setupFormValidation();
  }
  
  setupFormValidation() {
    const fields = ['postTitle', 'postCategory', 'postContent'];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      field.addEventListener('blur', () => {
        this.validateField(fieldId);
      });
      
      field.addEventListener('input', () => {
        this.clearFieldError(fieldId);
      });
    });
  }
  
  setupDataEvents() {
    // Export
    document.getElementById('exportBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.exportData();
    });
    
    // Import
    document.getElementById('importFile').addEventListener('change', (e) => {
      this.importData(e.target.files[0]);
    });
  }
  
  setupConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    const confirmBackdrop = document.getElementById('confirmBackdrop');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');
    
    // Ensure modal is hidden initially
    confirmModal.classList.add('hidden');
    
    [confirmBackdrop, confirmCancel].forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeConfirmModal();
      });
    });
    
    confirmAction.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.confirmCallback) {
        this.confirmCallback();
      }
      this.closeConfirmModal();
    });
  }
  
  // Modal Management
  openPostModal(post = null) {
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('postForm');
    
    this.editingPost = post;
    
    if (post) {
      modalTitle.textContent = 'Edit Post';
      this.populateForm(post);
    } else {
      modalTitle.textContent = 'Create New Post';
      form.reset();
      this.clearAllErrors();
      this.updateWordCount();
    }
    
    this.populateCategorySelect();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      document.getElementById('postTitle').focus();
    }, 100);
  }
  
  closePostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.editingPost = null;
    this.clearAllErrors();
  }
  
  openDetailModal(post) {
    const modal = document.getElementById('postDetailModal');
    const content = document.getElementById('postDetailContent');
    
    this.editingPost = post;
    
    content.innerHTML = `
      <div class="post-detail__header">
        <h1 class="post-detail__title">${this.escapeHtml(post.title)}</h1>
        <div class="post-detail__meta">
          <span class="post-detail__category">${post.category}</span>
          <span>${this.formatDate(post.dateCreated)}</span>
          <span>${post.readTime} min read</span>
        </div>
      </div>
      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${this.escapeHtml(post.title)}" class="post-detail__image" onerror="this.style.display='none'">` : ''}
      <div class="post-detail__content">
        ${this.formatContent(post.content)}
      </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  closeDetailModal() {
    const modal = document.getElementById('postDetailModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.editingPost = null;
  }
  
  closeAllModals() {
    this.closePostModal();
    this.closeDetailModal();
    this.closeConfirmModal();
    this.hideNotification();
  }
  
  // Form Management
  populateForm(post) {
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postImage').value = post.imageUrl || '';
    document.getElementById('postContent').value = post.content;
    
    this.updateImagePreview();
    this.updateWordCount();
  }
  
  populateCategorySelect() {
    const select = document.getElementById('postCategory');
    select.innerHTML = '<option value="">Select a category</option>';
    
    this.categories.slice(1).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  }
  
  updateImagePreview() {
    const imageUrl = document.getElementById('postImage').value;
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (imageUrl && this.isValidUrl(imageUrl)) {
      previewImg.src = imageUrl;
      preview.classList.remove('hidden');
      
      previewImg.onerror = () => {
        preview.classList.add('hidden');
        this.showFieldError('postImage', 'Invalid image URL or image failed to load');
      };
      
      previewImg.onload = () => {
        this.clearFieldError('postImage');
      };
    } else {
      preview.classList.add('hidden');
    }
  }
  
  updateWordCount() {
    const content = document.getElementById('postContent').value || '';
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = content.trim() ? words.length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Average 200 words per minute
    
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('readingTime').textContent = readTime;
  }
  
  // Validation
  validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    let isValid = true;
    
    switch (fieldId) {
      case 'postTitle':
        if (!value) {
          this.showFieldError(fieldId, 'Title is required');
          isValid = false;
        } else if (value.length < 3) {
          this.showFieldError(fieldId, 'Title must be at least 3 characters');
          isValid = false;
        } else if (value.length > 100) {
          this.showFieldError(fieldId, 'Title must be less than 100 characters');
          isValid = false;
        }
        break;
        
      case 'postCategory':
        if (!value) {
          this.showFieldError(fieldId, 'Category is required');
          isValid = false;
        }
        break;
        
      case 'postContent':
        if (!value) {
          this.showFieldError(fieldId, 'Content is required');
          isValid = false;
        } else if (value.length < 10) {
          this.showFieldError(fieldId, 'Content must be at least 10 characters');
          isValid = false;
        }
        break;
        
      case 'postImage':
        if (value && !this.isValidUrl(value)) {
          this.showFieldError(fieldId, 'Please enter a valid URL');
          isValid = false;
        }
        break;
    }
    
    return isValid;
  }
  
  validateForm() {
    const fields = ['postTitle', 'postCategory', 'postContent'];
    let isValid = true;
    
    fields.forEach(fieldId => {
      if (!this.validateField(fieldId)) {
        isValid = false;
      }
    });
    
    // Validate image URL if provided
    const imageUrl = document.getElementById('postImage').value.trim();
    if (imageUrl) {
      if (!this.validateField('postImage')) {
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorId = fieldId.replace('post', '').toLowerCase() + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (field && errorElement) {
      field.classList.add('error');
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }
  
  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorId = fieldId.replace('post', '').toLowerCase() + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (field && errorElement) {
      field.classList.remove('error');
      errorElement.classList.remove('show');
    }
  }
  
  clearAllErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    const formControls = document.querySelectorAll('.form-control');
    
    errorElements.forEach(element => element.classList.remove('show'));
    formControls.forEach(element => element.classList.remove('error'));
  }
  
  // Form Submission
  handleFormSubmit() {
    if (!this.validateForm()) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }
    
    const formData = {
      title: document.getElementById('postTitle').value.trim(),
      category: document.getElementById('postCategory').value,
      imageUrl: document.getElementById('postImage').value.trim() || null,
      content: document.getElementById('postContent').value.trim()
    };
    
    const words = formData.content.split(/\s+/).filter(word => word.length > 0);
    const readTime = Math.max(1, Math.ceil(words.length / 200));
    
    if (this.editingPost) {
      // Update existing post
      const postIndex = this.posts.findIndex(p => p.id === this.editingPost.id);
      if (postIndex !== -1) {
        this.posts[postIndex] = {
          ...this.posts[postIndex],
          ...formData,
          readTime,
          dateModified: new Date().toISOString()
        };
        this.showNotification('Post updated successfully!', 'success');
      }
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        ...formData,
        readTime,
        dateCreated: new Date().toISOString()
      };
      this.posts.unshift(newPost);
      this.showNotification('Post created successfully!', 'success');
    }
    
    this.savePosts();
    this.render();
    this.closePostModal();
  }
  
  // Post Management
  deletePost(postId) {
    this.posts = this.posts.filter(post => post.id !== postId);
    this.savePosts();
    this.render();
    this.closeDetailModal();
    this.showNotification('Post deleted successfully!', 'success');
  }
  
  confirmDelete(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    
    this.showConfirmDialog(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      () => this.deletePost(postId)
    );
  }
  
  // Data Import/Export
  exportData() {
    const data = {
      posts: this.posts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-posts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('Data exported successfully!', 'success');
  }
  
  importData(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.posts && Array.isArray(data.posts)) {
          this.showConfirmDialog(
            `This will replace all existing posts with ${data.posts.length} imported posts. Continue?`,
            () => {
              this.posts = data.posts;
              this.savePosts();
              this.render();
              this.showNotification(`Successfully imported ${data.posts.length} posts!`, 'success');
            }
          );
        } else {
          this.showNotification('Invalid file format', 'error');
        }
      } catch (error) {
        this.showNotification('Error reading file: ' + error.message, 'error');
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    document.getElementById('importFile').value = '';
  }
  
  // Filtering and Sorting
  getFilteredPosts() {
    let filteredPosts = [...this.posts];
    
    // Apply category filter
    if (this.currentFilter !== 'All') {
      filteredPosts = filteredPosts.filter(post => post.category === this.currentFilter);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(this.searchTerm) ||
        post.content.toLowerCase().includes(this.searchTerm) ||
        post.category.toLowerCase().includes(this.searchTerm)
      );
    }
    
    // Apply sorting
    filteredPosts.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        case 'oldest':
          return new Date(a.dateCreated) - new Date(b.dateCreated);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });
    
    return filteredPosts;
  }
  
  // Rendering
  render() {
    this.renderCategoryFilters();
    this.renderPosts();
    this.renderStatistics();
    this.renderRecentPosts();
    this.updateContentTitle();
  }
  
  renderCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    const postCounts = this.getPostCountsByCategory();
    
    container.innerHTML = '';
    
    this.categories.forEach(category => {
      const count = postCounts[category] || 0;
      const button = document.createElement('button');
      button.className = `category-filter ${this.currentFilter === category ? 'category-filter--active' : ''}`;
      button.innerHTML = `
        <span>${category}</span>
        <span class="category-filter__count">${count}</span>
      `;
      
      button.addEventListener('click', () => {
        this.currentFilter = category;
        this.render();
      });
      
      container.appendChild(button);
    });
  }
  
  renderPosts() {
    const container = document.getElementById('postsGrid');
    const noPosts = document.getElementById('noPosts');
    const filteredPosts = this.getFilteredPosts();
    
    if (filteredPosts.length === 0) {
      container.style.display = 'none';
      noPosts.classList.remove('hidden');
      return;
    }
    
    container.style.display = 'grid';
    noPosts.classList.add('hidden');
    
    container.innerHTML = '';
    
    filteredPosts.forEach((post, index) => {
      const postElement = this.createPostCard(post);
      postElement.style.animationDelay = `${index * 50}ms`;
      postElement.classList.add('animate-fade-in');
      container.appendChild(postElement);
    });
  }
  
  createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'post-card__action';
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openPostModal(post);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'post-card__action';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.confirmDelete(post.id);
    });
    
    const actions = document.createElement('div');
    actions.className = 'post-card__actions';
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    card.innerHTML = `
      ${post.imageUrl ? `
        <img src="${post.imageUrl}" alt="${this.escapeHtml(post.title)}" class="post-card__image" onerror="this.outerHTML='<div class=\\'post-card__image\\'>No Image</div>'">
      ` : '<div class="post-card__image">No Image</div>'}
      <div class="post-card__content">
        <div class="post-card__header">
          <h2 class="post-card__title">${this.escapeHtml(post.title)}</h2>
          <div class="post-card__meta">
            <span class="post-card__category">${post.category}</span>
            <span>${this.formatDate(post.dateCreated)}</span>
            <span>${post.readTime} min read</span>
          </div>
        </div>
        <p class="post-card__excerpt">${this.escapeHtml(post.content)}</p>
      </div>
    `;
    
    card.insertBefore(actions, card.firstChild);
    
    card.addEventListener('click', () => {
      this.openDetailModal(post);
    });
    
    return card;
  }
  
  renderStatistics() {
    const totalPosts = this.posts.length;
    const categoriesUsed = new Set(this.posts.map(post => post.category)).size;
    const totalReadingTime = this.posts.reduce((total, post) => total + post.readTime, 0);
    
    document.getElementById('totalPosts').textContent = totalPosts;
    document.getElementById('categoriesUsed').textContent = categoriesUsed;
    document.getElementById('totalReadingTime').textContent = `${totalReadingTime} min`;
  }
  
  renderRecentPosts() {
    const container = document.getElementById('recentPosts');
    const recentPosts = [...this.posts]
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      .slice(0, 5);
    
    container.innerHTML = '';
    
    recentPosts.forEach(post => {
      const element = document.createElement('div');
      element.className = 'recent-post';
      element.innerHTML = `
        <h4 class="recent-post__title">${this.escapeHtml(post.title)}</h4>
        <div class="recent-post__meta">
          <span>${post.category}</span>
          <span>${this.formatDate(post.dateCreated)}</span>
        </div>
      `;
      
      element.addEventListener('click', () => {
        this.openDetailModal(post);
      });
      
      container.appendChild(element);
    });
  }
  
  updateContentTitle() {
    const title = document.getElementById('contentTitle');
    const filteredPosts = this.getFilteredPosts();
    
    if (this.searchTerm) {
      title.textContent = `Search Results (${filteredPosts.length})`;
    } else if (this.currentFilter === 'All') {
      title.textContent = `All Posts (${filteredPosts.length})`;
    } else {
      title.textContent = `${this.currentFilter} (${filteredPosts.length})`;
    }
  }
  
  // Helper Methods
  getPostCountsByCategory() {
    const counts = { 'All': this.posts.length };
    
    this.categories.slice(1).forEach(category => {
      counts[category] = this.posts.filter(post => post.category === category).length;
    });
    
    return counts;
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  formatContent(content) {
    return content.replace(/\n/g, '<br>');
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  // Notification System
  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    messageElement.textContent = message;
    notification.className = `notification notification--${type}`;
    notification.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }
  
  hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
  }
  
  // Confirmation Dialog
  showConfirmDialog(message, callback) {
    const modal = document.getElementById('confirmModal');
    const messageElement = document.getElementById('confirmMessage');
    
    messageElement.textContent = message;
    this.confirmCallback = callback;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  
  closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.confirmCallback = null;
  }
}

// Initialize the application
let blog;

document.addEventListener('DOMContentLoaded', () => {
  blog = new EnhancedBlog();
  
  // Setup notification close button
  document.getElementById('notificationClose').addEventListener('click', () => {
    blog.hideNotification();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N for new post
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.target.closest('.modal')) {
      e.preventDefault();
      blog.openPostModal();
    }
    
    // Focus search with Ctrl/Cmd + F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.target.closest('.modal')) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
});