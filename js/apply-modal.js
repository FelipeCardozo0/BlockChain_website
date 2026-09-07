// Application Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const applyModal = document.getElementById('applyModal');
    const applyModalClose = document.getElementById('applyModalClose');
    const applyButton = document.querySelector('.apply-modal-button');
    
    if (!applyModal) return;

    // Check if modal was already closed in this session
    const modalClosed = sessionStorage.getItem('applyModalClosed');
    
    // Show modal if not closed in this session
    if (!modalClosed) {
        // Small delay for better UX
        setTimeout(() => {
            applyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 500);
    }

    // Close modal function
    function closeModal() {
        applyModal.classList.remove('active');
        document.body.style.overflow = '';
        // Remember that modal was closed for this session
        sessionStorage.setItem('applyModalClosed', 'true');
    }

    // Close button click
    if (applyModalClose) {
        applyModalClose.addEventListener('click', closeModal);
    }

    // Close on overlay click
    const overlay = applyModal.querySelector('.apply-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && applyModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Track Apply button click (optional analytics)
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            // You can add analytics tracking here if needed
            console.log('Apply button clicked from modal');
        });
    }
});
