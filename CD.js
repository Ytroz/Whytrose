document.addEventListener('DOMContentLoaded', function() {
    // Modal Setup for Notifications
    const messageModal = document.createElement('div');
    messageModal.className = 'modal fade';
    messageModal.id = 'messageModal';
    messageModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Notification</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modalMessage"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(messageModal);
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));

    function showModal(message) {
        document.getElementById('modalMessage').textContent = message;
        modal.show();
    }

    // Price Editing Modal
    const priceModal = document.createElement('div');
    priceModal.className = 'modal fade';
    priceModal.id = 'priceModal';
    priceModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Suite Prices</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="deluxePrice" class="form-label">Deluxe Room ($/night)</label>
                        <input type="number" class="form-control" id="deluxePrice" min="0" required>
                    </div>
                    <div class="mb-3">
                        <label for="royalPrice" class="form-label">Royal Suite ($/night)</label>
                        <input type="number" class="form-control" id="royalPrice" min="0" required>
                    </div>
                    <div class="mb-3">
                        <label for="presidentialPrice" class="form-label">Presidential Suite ($/night)</label>
                        <input type="number" class="form-control" id="presidentialPrice" min="0" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="savePrices">Save</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(priceModal);
    const priceModalInstance = new bootstrap.Modal(document.getElementById('priceModal'));

    // Suite Prices (stored in localStorage)
    let suitePrices = JSON.parse(localStorage.getItem('suitePrices')) || {
        deluxe: 800000,
        royal: 5000000,
        presidential: 7000000
    };

    // Update Prices on Booking Page
    function updatePrices() {
        const priceElements = document.querySelectorAll('.room-card .price');
        if (priceElements.length > 0) {
            priceElements.forEach(element => {
                const roomType = element.closest('.room-card').querySelector('.card-title').textContent.toLowerCase();
                if (roomType.includes('deluxe')) {
                    element.innerHTML = `From $${suitePrices.deluxe.toLocaleString()}/night`;
                } else if (roomType.includes('royal')) {
                    element.innerHTML = `From $${suitePrices.royal.toLocaleString()}/night`;
                } else if (roomType.includes('presidential')) {
                    element.innerHTML = `From $${suitePrices.presidential.toLocaleString()}/night`;
                }
            });
        }
    }

    // Price Editing Functionality
    const settingsLink = document.querySelector('.sidebar-menu .nav-link[href*="#settings"]');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-menu .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('deluxePrice').value = suitePrices.deluxe;
            document.getElementById('royalPrice').value = suitePrices.royal;
            document.getElementById('presidentialPrice').value = suitePrices.presidential;
            priceModalInstance.show();
        });
    }

    document.getElementById('savePrices')?.addEventListener('click', function() {
        const newDeluxe = parseInt(document.getElementById('deluxePrice').value);
        const newRoyal = parseInt(document.getElementById('royalPrice').value);
        const newPresidential = parseInt(document.getElementById('presidentialPrice').value);
        if (newDeluxe >= 0 && newRoyal >= 0 && newPresidential >= 0) {
            suitePrices = {
                deluxe: newDeluxe,
                royal: newRoyal,
                presidential: newPresidential
            };
            localStorage.setItem('suitePrices', JSON.stringify(suitePrices));
            updatePrices();
            priceModalInstance.hide();
            showModal('Suite prices updated successfully.');
        } else {
            showModal('Please enter valid price values.');
        }
    });

    // Booking Data (stored in localStorage)
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [
        { id: '#BKG-7854', guest: 'John Smith', room: 'Deluxe Room', checkIn: '2025-05-12', checkOut: '2025-05-15', status: 'Checked In', price: 2400000 },
        { id: '#BKG-7853', guest: 'Emily Johnson', room: 'Royal Suite', checkIn: '2025-05-10', checkOut: '2025-05-17', status: 'Checked In', price: 35000000 },
        { id: '#BKG-7852', guest: 'Michael Brown', room: 'Deluxe Room', checkIn: '2025-05-15', checkOut: '2025-05-18', status: 'Pending', price: 2400000 },
        { id: '#BKG-7851', guest: 'Sarah Williams', room: 'Presidential Suite', checkIn: '2025-05-18', checkOut: '2025-05-22', status: 'Pending', price: 28000000 },
        { id: '#BKG-7850', guest: 'David Miller', room: 'Deluxe Room', checkIn: '2025-05-05', checkOut: '2025-05-10', status: 'Checked Out', price: 4000000 }
    ];

    // Calculate nights between two dates
    function calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Update Bookings Table
    function updateBookingsTable() {
        const table = document.querySelector('.table.table-hover');
        const tbody = table ? table.querySelector('tbody') : null;
        if (!table || !tbody) {
            console.warn('Bookings table or tbody not found in the DOM');
            return;
        }
        tbody.innerHTML = '';
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            const statusClass = {
                'Checked In': 'badge-success',
                'Pending': 'badge-warning',
                'Checked Out': 'badge-danger'
            }[booking.status];
            const priceDisplay = booking.price ? `$${booking.price.toLocaleString()}` : 'N/A';
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.guest}</td>
                <td>${booking.room}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td><span class="badge ${statusClass}">${booking.status}</span></td>
                <td>${priceDisplay}</td>
                <td>
                    <select class="form-select status-select" data-id="${booking.id}">
                        <option value="Checked In" ${booking.status === 'Checked In' ? 'selected' : ''}>Checked In</option>
                        <option value="Pending" ${booking.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Checked Out" ${booking.status === 'Checked Out' ? 'selected' : ''}>Checked Out</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Reattach status change event listeners
        const statusSelects = document.querySelectorAll('.status-select');
        statusSelects.forEach(select => {
            select.removeEventListener('change', handleStatusChange);
            select.addEventListener('change', handleStatusChange);
        });
    }

    // Handle status change
    function handleStatusChange(event) {
        const bookingId = event.target.dataset.id;
        const newStatus = event.target.value;
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = newStatus;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            showModal(`Status for booking ${bookingId} updated to ${newStatus}.`);
            updateBookingsTable();
        } else {
            showModal('Error: Booking not found.');
        }
    }

    // Initialize Bookings Table
    updateBookingsTable();

    // Booking Form Integration
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const roomType = document.getElementById('roomType').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            
            if (!roomType || roomType === '') {
                showModal('Please select a specific room type.');
                return;
            }
            if (!checkIn || !checkOut) {
                showModal('Please select valid check-in and check-out dates.');
                return;
            }

            const roomMap = {
                deluxe: 'Deluxe Room',
                royal: 'Royal Suite',
                presidential: 'Presidential Suite'
            };
            const priceMap = {
                deluxe: suitePrices.deluxe,
                royal: suitePrices.royal,
                presidential: suitePrices.presidential
            };
            
            const nights = calculateNights(checkIn, checkOut);
            const pricePerNight = priceMap[roomType] || suitePrices.deluxe;
            const totalPrice = pricePerNight * nights;

            const newBooking = {
                id: `#BKG-${Math.floor(1000 + Math.random() * 9000)}`,
                guest: fullName,
                room: roomMap[roomType],
                checkIn: checkIn,
                checkOut: checkOut,
                status: 'Pending',
                price: totalPrice
            };
            
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            showModal(`Booking submitted successfully for ${fullName}! Total: $${totalPrice.toLocaleString()} for ${nights} nights. Awaiting confirmation.`);
            bookingForm.reset();
            updateBookingsTable();
        });
    }

    // Chart Tooltip Functionality
    const chartMain = document.querySelector('.chart-main');
    if (chartMain) {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.display = 'none';
        chartMain.appendChild(tooltip);

        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            bar.addEventListener('mouseenter', function(e) {
                const value = this.dataset.value;
                const date = this.dataset.date;
                const type = this.dataset.type;
                if (value && date && type) {
                    tooltip.textContent = `${type}: ${value} (${date})`;
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY - 30}px`;
                }
            });

            bar.addEventListener('mousemove', function(e) {
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY - 30}px`;
            });

            bar.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
            });
        });
    }

    // Chart Period Selection
    const periodButtons = document.querySelectorAll('.btn-group-period .btn');
    const chartBarsGroups = document.querySelectorAll('.chart-bar-group');
    if (periodButtons.length > 0 && chartBarsGroups.length > 0) {
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                periodButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const period = this.textContent.toLowerCase();

                const dataSets = {
                    week: [
                        { arrivals: 12, departures: 8, occupancy: '65%', date: 'Mon' },
                        { arrivals: 10, departures: 7, occupancy: '70%', date: 'Tue' },
                        { arrivals: 15, departures: 6, occupancy: '80%', date: 'Wed' },
                        { arrivals: 11, departures: 10, occupancy: '75%', date: 'Thu' },
                        { arrivals: 18, departures: 7, occupancy: '85%', date: 'Fri' },
                        { arrivals: 20, departures: 4, occupancy: '90%', date: 'Sat' },
                        { arrivals: 8, departures: 14, occupancy: '60%', date: 'Sun' }
                    ],
                    month: [
                        { arrivals: 50, departures: 40, occupancy: '70%', date: 'Week 1' },
                        { arrivals: 60, departures: 45, occupancy: '75%', date: 'Week 2' },
                        { arrivals: 55, departures: 50, occupancy: '80%', date: 'Week 3' },
                        { arrivals: 65, departures: 55, occupancy: '78%', date: 'Week 4' }
                    ],
                    year: [
                        { arrivals: 200, departures: 180, occupancy: '65%', date: 'Jan' },
                        { arrivals: 220, departures: 190, occupancy: '70%', date: 'Feb' },
                        { arrivals: 250, departures: 200, occupancy: '75%', date: 'Mar' },
                        { arrivals: 230, departures: 210, occupancy: '73%', date: 'Apr' },
                        { arrivals: 260, departures: 220, occupancy: '80%', date: 'May' },
                        { arrivals: 280, departures: 230, occupancy: '85%', date: 'Jun' },
                        { arrivals: 270, departures: 240, occupancy: '82%', date: 'Jul' },
                        { arrivals: 290, departures: 250, occupancy: '87%', date: 'Aug' },
                        { arrivals: 300, departures: 260, occupancy: '90%', date: 'Sep' },
                        { arrivals: 310, departures: 270, occupancy: '88%', date: 'Oct' },
                        { arrivals: 320, departures: 280, occupancy: '86%', date: 'Nov' },
                        { arrivals: 330, departures: 290, occupancy: '84%', date: 'Dec' }
                    ]
                };

                const newData = dataSets[period];
                const maxArrivals = period === 'week' ? 20 : period === 'month' ? 70 : 350;
                const maxDepartures = maxArrivals;

                chartBarsGroups.forEach((group, index) => {
                    if (index < newData.length) {
                        const bars = group.querySelectorAll('.chart-bar');
                        bars[0].style.height = `${(newData[index].arrivals / maxArrivals) * 100}%`;
                        bars[0].dataset.value = newData[index].arrivals;
                        bars[0].dataset.date = newData[index].date;
                        bars[1].style.height = `${(newData[index].departures / maxDepartures) * 100}%`;
                        bars[1].dataset.value = newData[index].departures;
                        bars[1].dataset.date = newData[index].date;
                        bars[2].style.height = `${parseInt(newData[index].occupancy)}%`;
                        bars[2].dataset.value = newData[index].occupancy;
                        bars[2].dataset.date = newData[index].date;
                        group.style.display = 'flex';
                    } else {
                        group.style.display = 'none';
                    }
                });

                const xAxis = document.querySelector('.chart-x-axis');
                if (xAxis) {
                    xAxis.innerHTML = newData.map(data => `<span>${data.date}</span>`).join('');
                }
            });
        });
    }

    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (!this.href.includes('#settings')) {
                    document.querySelectorAll('.sidebar-menu .nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    const destination = this.textContent.trim();
                    showModal(`Navigating to ${destination} page...`);
                    if (this.href.includes('booking.html')) {
                        window.location.href = '/index.html#booking';
                    } else if (this.href.includes('CD.html')) {
                        window.location.href = '/CD.html';
                    }
                }
            });
        });
    }

    // Quick Action Buttons
    const actionButtons = document.querySelectorAll('.card .btn-outline-primary.btn-block');
    if (actionButtons.length > 0) {
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim();
                showModal(`Performing action: ${action}`);
                if (action.includes('New Booking')) {
                    window.location.href = '/index.html#booking';
                }
            });
        });
    }

    // View All Bookings Link
    const viewAllBookings = document.querySelector('.card-header .btn-outline-primary');
    if (viewAllBookings) {
        viewAllBookings.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('Viewing all bookings...');
        });
    }

    // Sidebar Toggle for Mobile
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-primary d-md-none position-fixed top-0 start-0 m-2';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('d-none');
        });

        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
                sidebar.classList.add('d-none');
            }
        });
    }

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modalImage = document.getElementById('modalImage');
    if (galleryItems.length > 0 && modalImage) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.dataset.img;
                modalImage.src = imgSrc;
            });
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize Prices
    updatePrices();
});