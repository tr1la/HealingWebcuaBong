document.addEventListener('DOMContentLoaded', () => {

    // ==============================================
    // 1. TÙY CHỈNH: NGÀY BẮT ĐẦU ĐIỀU TRỊ
    // ==============================================
    // Thay 'YYYY-MM-DD' bằng ngày bắt đầu. Ví dụ: '2025-10-30'
    const START_DATE = '2025-10-22'; 

    // ==============================================
    // 2. TÙY CHỈNH: DANH SÁCH LỜI CHÚC
    // ==============================================
    // Thêm bao nhiêu lời chúc cũng được, đặt trong dấu ""
    const MESSAGES = [
        "Cười nhiều lên xinh gái không bằng lái!",
        "Uống đủ thuốc uống đủ thuốc uống đủ thuốc!",
        "Ăn nhiều chóng khoẻ chóng lớn!",
        "Khéo lo nhé, mình có bác sĩ riêng mà, dogtor Bi ấy =)))",
        "Siêu anh hùng nào cũng cần đồng minh, tuyển dụng alo 0855868935.",
        "Có phải là \"Bông\" trong \"Bông hoa\", \"Dung\" trong \"Công Dung Ngôn Hạnh\" không ạ =)))",
        "Nao khỏi mình làm tí kem chống sẹo vào nhíe!",
        "Nay lạnh lắm, mình mặc ấm tí nhí!",
        "Hôm đi xem phim ý, không phải là em không thích ăn kem đâu, em nhường chị mà.",
        "Sao lúc mình xem phim lại cho chân lên ghế cuộn tròn lại như mèo vậy ạ, cute thế =))",
        "Ig của em bị lỗi không hiện thông báo thật đấy ạ =((((",
        "In Bông we trust."
    ];

    // ==============================================
    // 3. TÙY CHỈNH: DANH SÁCH NHẠC (YOUTUBE)
    // ==============================================
    // Lấy ID của video YouTube (phần sau ?v=)
    // Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> ID là 'dQw4w9WgXcQ'
    const SONGS = [
        'Af1xkpiALVM', // Thay bằng ID bài hát 1
        'DcCISK3sCYg', // Thay bằng ID bài hát 2
        'YM5nx2s8cz0', // Thay bằng ID bài hát 3
        'Pc1CD6sDuPc',
        '8HcN_JOSZ34',
        'SMyzXbdGxVY',
        '42fX4KKYNjQ',
        'AmvA-XJF0j8',
        'HXkh7EOqcQ4',
        'GGh0dfj2zfY',
        'izOA4DIUT18',
        'SDNEti5YyJU',
        'v2WvTFUuPTE',
        'XmTLFtbv0Oo',
        'bG1hdMJdoBo',
        'XyAypzE6pt0',
        'YxyaZE7gJLw',
        'ji8cjaFUIU0',
        '-KhfFjCwFDU',
        'f9P7_qWrf38',
        'o2_ZIAWVqRI',
        'GgQFO8dL5XQ',
        '6DufHnGH690',
        'T_lC2O1oIew',
        '2fDzCWNS3ig',
        'uQFVqltOXRg',
        'Sv5yCzPCkv8',
        'JLd09jmEAYA',
        'HfWLgELllZs',
          // Thêm bao nhiêu ID cũng được
    ];

    // ==============================================
    // 4. TÙY CHỈNH: NÚT "CHÁN" (Dùng Discord Webhook)
    // ==============================================
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433925077447086251/fVglZ9NPpZwyVsfDs3txSMACGAT5-SoMyIkpOaOvlGp7pwMbfGvRYVogpysjiFs6O8nh'; //DÁN WEBHOOK URL VÀO ĐÂY

    // ----- HẾT PHẦN TÙY CHỈNH -----


    // Lấy các phần tử DOM
    const daysCountEl = document.getElementById('days-count');
    const jarEl = document.getElementById('message-jar');
    const jarStatusEl = document.getElementById('jar-status');
    const popupEl = document.getElementById('message-popup');
    const messageTextEl = document.getElementById('message-text');
    const closePopupEl = document.getElementById('close-popup');
    const youtubePlayerEl = document.getElementById('youtube-player');
    const boredButtonEl = document.getElementById('bored-button');
    const boredStatusEl = document.getElementById('bored-status');

    // 1. Chức năng Đếm Ngày
    function updateDayCounter() {
        const startDate = new Date(START_DATE);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        // +1 để tính cả ngày bắt đầu
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        
        daysCountEl.textContent = diffDays;
    }

    // 2. Chức năng Lọ Lời Chúc (ĐÃ CẬP NHẬT LOGIC RANDOM)
    function handleJarClick() {
        const today = new Date().toLocaleDateString('vi-VN');
        const lastOpened = localStorage.getItem('jarLastOpened');

        if (lastOpened === today) {
            // Đã mở hôm nay rồi
            jarStatusEl.textContent = 'Mai mình mở tiếp nha!';
            // Thêm hiệu ứng lắc lọ khi đã mở
            jarEl.classList.remove('clicked'); 
            void jarEl.offsetWidth; 
            jarEl.classList.add('clicked');
        } else { 

            // --- LOGIC RANDOM KHÔNG TRÙNG LẶP ---
            
            // 1. Lấy danh sách index đã xem từ localStorage
            let seenIndices = [];
            try {
                // Thử lấy danh sách đã lưu
                seenIndices = JSON.parse(localStorage.getItem('seenMessageIndices')) || [];
            } catch (e) {
                // Nếu bị lỗi (ví dụ: text không phải JSON), reset mảng
                console.error("Lỗi parse seenMessageIndices: ", e);
                seenIndices = [];
            }

            // 2. Kiểm tra xem đã xem hết tất cả message chưa
            if (seenIndices.length >= MESSAGES.length) {
                // Nếu đã xem hết, reset mảng seenIndices về rỗng
                seenIndices = [];
                jarStatusEl.textContent = 'Hết lời nhắn mất roai! Mình xem lại nhé!';
            } else {
                jarStatusEl.textContent = ''; // Xóa thông báo cũ
            }

            // 3. Tìm một index mới (random) mà chưa có trong mảng seenIndices
            let randomIndex;
            let message;
            
            // Vòng lặp này sẽ chạy cho đến khi tìm được 1 index CHƯA XUẤT HIỆN
            while(true) {
                randomIndex = Math.floor(Math.random() * MESSAGES.length);
                if (!seenIndices.includes(randomIndex)) {
                    // Đã tìm thấy index mới!
                    message = MESSAGES[randomIndex];
                    break; // Thoát khỏi vòng lặp
                }
                // Nếu index đã có, vòng lặp sẽ tự động chạy lại
            }

            // 4. Lưu lại index mới này vào mảng và cập nhật localStorage
            seenIndices.push(randomIndex);
            localStorage.setItem('seenMessageIndices', JSON.stringify(seenIndices));
            
            // --- KẾT THÚC LOGIC RANDOM ---
            
            // (Code hiệu ứng từ lượt trước)
            jarEl.classList.remove('clicked'); 
            void jarEl.offsetWidth; 
            jarEl.classList.add('clicked'); 

            // Reset trạng thái chữ
            messageTextEl.textContent = ''; 
            messageTextEl.style.opacity = '0'; 

            // Hiện popup
            popupEl.classList.add('visible');
            
            // Chờ hiệu ứng giấy mở ra rồi mới gõ chữ
            setTimeout(() => {
                typeMessage(message, messageTextEl); // Dùng 'message' mới tìm được
            }, 600); // Phải khớp với thời gian transition của .message-content (0.6s)
            
            // Lưu lại ngày đã mở (nếu bạn muốn dùng lại logic "mỗi ngày 1 lần")
            localStorage.setItem('jarLastOpened', today);
        }
    }

    // Hàm gõ chữ (Mới)
    function typeMessage(message, element) {
        let i = 0;
        element.style.opacity = '1'; // Hiện khung chữ
        element.textContent = ''; // Xóa nội dung cũ để gõ lại

        const typingInterval = setInterval(() => {
            if (i < message.length) {
                element.textContent += message.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50); // Tốc độ gõ chữ, 50ms mỗi ký tự
    }

    // Đóng popup (Đã cập nhật)
    closePopupEl.addEventListener('click', () => {
        popupEl.classList.remove('visible');
        jarEl.classList.remove('clicked'); // Reset animation lọ
    });
    // Đóng khi click ra ngoài (Đã cập nhật)
    popupEl.addEventListener('click', (e) => {
        if (e.target === popupEl) {
            popupEl.classList.remove('visible');
            jarEl.classList.remove('clicked'); // Reset animation lọ
        }
    });

    jarEl.addEventListener('click', handleJarClick);

    // 3. Chức năng Nhạc Hàng Ngày
    function loadDailySong() {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const songIndex = dayOfYear % SONGS.length;
        const songId = SONGS[songIndex];
        
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${songId}`);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        
        youtubePlayerEl.innerHTML = ''; // Xóa cái cũ (nếu có)
        youtubePlayerEl.appendChild(iframe);
    }

    // 4. Chức năng Nút "Chán"
    function handleBoredClick() {
        boredButtonEl.disabled = true;
        boredStatusEl.textContent = 'Đang gửi tín hiệu...';

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: "🚨 BÁO ĐỘNG CHÁN! 🚨 \nBông đang chán kìa cu!"
            })
        })
        .then(response => {
            if (response.ok) {
                boredStatusEl.textContent = 'Đã gửi tín hiệu! Đợi xíuu!';
            } else {
                boredStatusEl.textContent = 'Tín hiệu lỗi! Thử lại sau nhí...';
            }
            // Cho phép bấm lại sau 10 giây
            setTimeout(() => {
                boredButtonEl.disabled = false;
                boredStatusEl.textContent = '';
            }, 10000);
        })
        .catch(error => {
            console.error('Lỗi Webhook:', error);
            boredStatusEl.textContent = 'Tín hiệu lỗi! Thử lại sau nhí...';
            boredButtonEl.disabled = false;
        });
    }

    boredButtonEl.addEventListener('click', handleBoredClick);

    // Chạy các hàm khi tải trang
    updateDayCounter();
    loadDailySong();

});