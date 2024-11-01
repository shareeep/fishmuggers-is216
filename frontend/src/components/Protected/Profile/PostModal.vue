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
                        <p class="likes-caption">{{ post.likes }} Likes</p>
                        <button @click="toggleLike(post)" class="like-button">
                            <i
                                :class="post.isLiked ? 'fas fa-thumbs-up thumbs-up-icon' : 'far fa-thumbs-up thumbs-up-icon'"></i>
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
import { computed, defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
    post: Object,
    userData: Object,
    selectedPostIndex: Number,
    totalPosts: Number,
});

const emit = defineEmits(['close', 'prev', 'next']);

const isLiked = ref(false);

const closeModal = () => {
    emit('close');
};

const prevPost = () => {
    if (!isFirstPost.value) emit('prev');
};

const nextPost = () => {
    if (!isLastPost.value) emit('next');
};

const toggleLike = (post) => {
    // Toggle like state for the specific post
    post.isLiked = !post.isLiked;
    post.isLiked ? post.likes++ : post.likes--; // Increment or decrement likes
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

.caption-text {
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
    /* Outline color */
    transition: color 0.2s ease;
    cursor: pointer;
}

.fas.fa-thumbs-up {
    color: black;
    /* Filled color */
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
</style>