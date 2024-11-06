<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="modal-actions">
                <button @click="confirm" class="confirm-button">Yes</button>
                <button @click="close" class="cancel-button">No</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ConfirmationModal",
    props: {
        title: String,
        message: String,
    },
    methods: {
        confirm() {
            this.$emit("confirm");
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
/* Smaller, more sleek modal overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* Reduced opacity for a subtler effect */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Smaller, more centered modal content */
.modal-content {
    background-color: #fff;
    padding: 20px;
    width: 300px;
    /* Reduced width for a sleeker look */
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

/* Adjusted modal title and message */
h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

p {
    margin: 10px 0 20px;
    color: #666;
}

/* Sleeker button styles */
.modal-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.confirm-button {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-button {
    background-color: #ccc;
    color: #333;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-button:hover {
    background-color: #45a049;
}

.cancel-button:hover {
    background-color: #bbb;
}
</style>