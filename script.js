document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const postCountBadge = document.getElementById('postCount');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');

    // Since we are not using Vite, we use a relative path
    const API_URL = 'https://backend-project-barq.onrender.com/api/posts';

    // Fetch and display posts on load
    fetchPosts();

    // Handle form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const postData = {
          
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value,
            status: document.getElementById('status').value,
            content: document.getElementById('content').value
        };

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                postForm.reset();
                await fetchPosts();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch(API_URL);
            const posts = await response.json();
            
            displayPosts(posts);
            postCountBadge.textContent = `${posts.length} Posts`;
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (postsContainer) {
                postsContainer.innerHTML = '<div class="empty-state">Error loading posts. Please try again.</div>';
            }
        }
    }

    function displayPosts(posts) {
        if (!postsContainer) return;

        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No posts yet. Start by creating one!</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <div class="post-card glass">
                ${post.imageUrl ? `<img src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.title)}" class="post-image" onerror="this.src='https://placehold.co/600x400/1e293b/f8fafc?text=No+Image'">` : ''}
                <div class="post-body">
                    <div class="post-meta">
                        <div class="post-user">By ${escapeHtml(post.user)}</div>
                        <div class="status-tag status-${post.status || 'published'}">${escapeHtml(post.status || 'published')}</div>
                    </div>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p class="post-desc">${escapeHtml(post.description || '')}</p>
                    <div class="post-content">
                        ${escapeHtml(post.content).replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Publishing...';
            loader.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Publish Post';
            loader.style.display = 'none';
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
