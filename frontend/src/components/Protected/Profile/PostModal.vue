<template>
    <div class="post-modal" @click.self="closeModal">
        <div class="modal-content">
            <!-- Left Column: Post Image -->
            <div class="modal-left">
                <img :src="post.image" alt="Selected Post" class="modal-image" />
            </div>
 
            <!-- Right Column: User Info, Caption, and Likes -->
            <div class="modal-right">
                <!-- User Info Header -->
                <div class="post-header">
                    <div class="user-info">
                        <img :src="userData.profileImage || 'https://via.placeholder.com/50?text=Avatar'"
                            alt="User Avatar" class="avatar" />
                        <h3 class="user-name">{{ userData.username }}</h3>
                    </div>
                </div>

                <!-- Post Caption and Likes -->
                <div class="post-footer">
                    <div class="caption-container">
                        <img :src="userData.profileImage || 'https://via.placeholder.com/50?text=Avatar'"
                            alt="User Avatar" class="avatar-caption" />
                        <span class="caption-text">
                            <span class="user-name-caption">{{ userData.username }}</span>
                            {{ post.caption }}
                        </span>
                    </div>

                    <div class="likes-container">
                        <p class="likes-caption">{{ Array.isArray(post.likes) ? post.likes.length : 0 }} Likes</p>

                        <button @click="toggleLike" class="like-button">
                            <i
                                :class="isLiked ? 'fas fa-thumbs-up thumbs-up-icon' : 'far fa-thumbs-up thumbs-up-icon'"></i>
                            Like
                        </button>
                    </div>
                </div>
            </div>

            <!-- Navigation and Close Icons -->
            <i class="fas fa-chevron-left nav-arrow" :class="{ disabled: isFirstPost }" @click="prevPost"></i>
            <i class="fas fa-chevron-right nav-arrow" :class="{ disabled: isLastPost }" @click="nextPost"></i>
            <i class="fas fa-times close-modal" @click="closeModal"></i>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { getAuth } from 'firebase/auth';

const props = defineProps({
    post: Object,
    userData: Object,
    selectedPostIndex: Number,
    totalPosts: Number,
});

const emit = defineEmits(['close', 'prev', 'next', 'like-toggle']);

// Get current user's ID
const auth = getAuth();
const currentUser = auth.currentUser;
const currentUserId = currentUser ? currentUser.uid : null;

// Computed property to check if current user has liked the post
const isLiked = computed(() => {
  if (!currentUserId || !Array.isArray(props.post.likes)) return false;
  return props.post.likes.includes(currentUserId);
});


const closeModal = () => {
    emit('close');
};

const prevPost = () => {
    if (!isFirstPost.value) emit('prev');
};

const nextPost = () => {
    if (!isLastPost.value) emit('next');
};

const toggleLike = () => {
  if (!currentUserId) {
    alert("You need to be logged in to like posts.");
    return;
  }
  emit('like-toggle', { postId: props.post.postId, isLiked: !isLiked.value });
};

// Computed properties to check if on the first or last post
const isFirstPost = computed(() => props.selectedPostIndex === 0);
const isLastPost = computed(() => props.selectedPostIndex === props.totalPosts - 1);
</script>

<style scoped>
.post-modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    display: flex;
    background: #fff;
    border-radius: 10px;
    max-height: 90vh;
    overflow: hidden;
    width: auto;
}

.modal-left {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    background-color: #f8f8f8;
    overflow: hidden;
    flex: 0 0 auto;
}

.modal-image {
    width: auto;
    height: 100%;
    object-fit: cover;
}

.modal-right {
    flex: 0 0 auto;
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 400px;
    padding: 20px;
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    width: 100%;
}

.user-info {
    display: flex;
    align-items: center;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
}

.user-name {
    font-size: 1.2rem;
    font-weight: bold;
}

.post-footer {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
}

.caption-container {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
}

.avatar-caption {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
}

.user-name-caption {
    font-weight: bold;
    margin-right: 5px;
    color: black;
}

.caption-text {
    margin-top: 6px;
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
    overflow-wrap: break-word;
    white-space: normal;
    text-align: left;
}

.likes-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    width: 100%;
    margin-top: auto;
}

.likes-caption {
    font-size: 1rem;
    font-weight: bold;
    color: #666;
}

.like-button {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    color: black;
    background: none;
    border: none;
    cursor: pointer;
}

.like-button:hover {
    transform: scale(1.05);
}

.like-button:active {
    transform: scale(0.98);
}

.thumbs-up-icon {
    color: grey;
    transition: color 0.2s ease;
    cursor: pointer;
}

.fas.fa-thumbs-up {
    color: black;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    font-size: 2rem;
    color: #fff;
    cursor: pointer;
    user-select: none;
}

.nav-arrow:hover {
    color: #ddd;
}

.fa-chevron-left {
    left: 10px;
}

.fa-chevron-right {
    right: 10px;
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;
}

.nav-arrow.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

/* Responsive adjustments */
@media (min-width: 767px) {
    .modal-content {
        flex-direction: row;
        max-width: 80vw;
        max-height: 80vh;
    }

    .modal-left {
        height: auto;
        flex: 1;
    }

    .modal-image {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .modal-right {
        padding: 20px;
        flex: 1;
    }

    .post-header {
        display: flex;
    }

    .user-name {
        font-size: 1.4rem;
    }

    .likes-caption,
    .like-button,
    .caption-text {
        font-size: 1.1rem;
    }

    .nav-arrow {
        font-size: 2.5rem;
    }
}

@media (max-width: 767px) {
    .modal-content {
        flex-direction: column;
        width: 100%;
        max-width: 350px;
        height: auto;
    }

    .modal-left,
    .modal-right {
        width: 100%;
    }

    .modal-right {
        padding: 10px;
    }

    .modal-left {
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-image {
        width: 100%;
        height: auto;
    }

    .avatar,
    .avatar-caption {
        width: 40px;
        height: 40px;
    }

    .user-name,
    .likes-caption {
        font-size: 1rem;
    }

    .like-button,
    .caption-text {
        font-size: 0.9rem;
    }

    .nav-arrow {
        font-size: 1.5rem;
    }

    /* Hide the post-header on small screens */
    .post-header {
        display: none;
    }
}
</style>
