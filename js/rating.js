class RatingSystem {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    }

    addRating(workerId, rating, comment) {
        if (!this.ratings[workerId]) {
            this.ratings[workerId] = [];
        }

        this.ratings[workerId].push({
            rating,
            comment,
            date: new Date(),
            userId: this.getCurrentUserId()
        });

        this.saveRatings();
        this.updateWorkerRating(workerId);
    }

    getAverageRating(workerId) {
        const workerRatings = this.ratings[workerId] || [];
        if (workerRatings.length === 0) return 0;

        const sum = workerRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / workerRatings.length).toFixed(1);
    }

    saveRatings() {
        localStorage.setItem('ratings', JSON.stringify(this.ratings));
    }
} 