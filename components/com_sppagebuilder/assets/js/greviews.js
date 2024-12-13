document.addEventListener("DOMContentLoaded", function () {
  const reviewContainers = document.querySelectorAll(
    ".google-reviews-container"
  );

  reviewContainers.forEach((container) => {
    const placeId = container.getAttribute("data-place-id");
    const displayMode = container.getAttribute("data-display-mode");
    const maxLength = parseInt(container.getAttribute("data-maxlength"), 10);

    if (!placeId) {
      container.innerHTML = "<p>No Place ID provided.</p>";
      return;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: placeId,
        fields: ["reviews"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          container.innerHTML =
            "<p>Unable to fetch reviews. Please check your API key and Place ID.</p>";
          return;
        }

        const reviews = place.reviews || [];
        if (reviews.length === 0) {
          container.innerHTML =
            "<p>No reviews available for this location.</p>";
          return;
        }

        let output = "";
        if (displayMode === "CAROUSEL") {
          output +=
            '<div id="carousel-' +
            placeId +
            '" class="carousel slide" data-bs-ride="carousel">';
          output += '<div class="carousel-inner">';

          reviews.forEach((review, index) => {
            output += `
                            <div class="carousel-item ${
                              index === 0 ? "active" : ""
                            }">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center mb-3">
                                            <img src="${
                                              review.profile_photo_url
                                            }" alt="${
              review.author_name
            }" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;" />
                                            <div class="ms-3">
                                                <h5>${review.author_name}</h5>
                                                <div>${generateStars(
                                                  review.rating
                                                )}</div>
                                            </div>
                                        </div>
                                        <p>${truncateText(
                                          review.text,
                                          maxLength
                                        )}</p>
                                    </div>
                                </div>
                            </div>`;
          });

          output += "</div>";
          output += `
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${placeId}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${placeId}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>`;
          output += "</div>";
        } else {
          output +=
            '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">';
          reviews.forEach((review) => {
            output += `
                            <div class="col-md-4">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center mb-3">
                                            <img src="${
                                              review.profile_photo_url
                                            }" alt="${
              review.author_name
            }" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;" />
                                            <div class="ms-3">
                                                <h5>${review.author_name}</h5>
                                                <div>${generateStars(
                                                  review.rating
                                                )}</div>
                                            </div>
                                        </div>
                                        <p>${truncateText(
                                          review.text,
                                          maxLength
                                        )}</p>
                                    </div>
                                </div>
                            </div>`;
          });
          output += "</div>";
        }

        container.innerHTML = output;
      }
    );
  });

  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  function generateStars(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < rating
          ? '<i class="fas fa-star text-warning"></i>'
          : '<i class="far fa-star text-muted"></i>';
    }
    return stars;
  }
});
