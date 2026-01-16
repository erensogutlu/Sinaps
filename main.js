const canvas = document.getElementById("sinapsCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
	constructor(x, y) {
		this.x = x || Math.random() * canvas.width;
		this.y = y || Math.random() * canvas.height;
		this.vx = (Math.random() - 0.5) * 1;
		this.vy = (Math.random() - 0.5) * 1;
		this.size = Math.random() * 2 + 1;
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
		if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
	}
	draw() {
		const isDark = document.body.classList.contains("dark-mode");
		ctx.fillStyle = isDark
			? "rgba(179, 136, 255, 0.7)"
			: "rgba(98, 0, 234, 0.5)";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

function initParticles() {
	particles = [];
	for (let i = 0; i < 60; i++) particles.push(new Particle());
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const isDark = document.body.classList.contains("dark-mode");

	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();

		for (let j = i; j < particles.length; j++) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 150) {
				ctx.beginPath();
				ctx.strokeStyle = isDark
					? `rgba(0, 229, 255, ${1 - distance / 150})`
					: `rgba(98, 0, 234, ${1 - distance / 150})`;
				ctx.lineWidth = 1;
				ctx.moveTo(particles[i].x, particles[i].y);
				ctx.lineTo(particles[j].x, particles[j].y);
				ctx.stroke();
			}
		}
	}
	requestAnimationFrame(animate);
}
initParticles();
animate();

// canvas tıklama etkileşimi
canvas.addEventListener("click", (e) => {
	for (let i = 0; i < 5; i++) {
		particles.push(new Particle(e.clientX, e.clientY));
	}
	if (particles.length > 100) {
		particles.splice(0, 5);
	}
});

// ui etkileşimleri
window.addEventListener("scroll", () => {
	const header = document.getElementById("header");
	const yukariCikBtn = document.getElementById("yukariCikBtn");

	if (window.scrollY > 50) {
		header.classList.add("kaydirildi");
		yukariCikBtn.classList.add("aktif");
	} else {
		header.classList.remove("kaydirildi");
		yukariCikBtn.classList.remove("aktif");
	}
});

function toggleTheme() {
	document.body.classList.toggle("dark-mode");
	const btn = document.querySelector(".tema-btn i");
	if (document.body.classList.contains("dark-mode"))
		btn.classList.replace("fa-moon", "fa-sun");
	else btn.classList.replace("fa-sun", "fa-moon");
}

// sss akordeon
function toggleFaq(element) {
	const item = element.parentElement;
	item.classList.toggle("active");
}

// iban kopyalama
function copyIBAN() {
	const iban = document.getElementById("ibanText").innerText;
	navigator.clipboard.writeText(iban).then(() => {
		const btn = document.querySelector(".copy-btn");
		const originalHtml = btn.innerHTML;
		btn.innerHTML = '<i class="fa-solid fa-check"></i> Kopyalandı';
		setTimeout(() => {
			btn.innerHTML = originalHtml;
		}, 2000);
	});
}

// bülten gönderimi
function newsletterSubmit(e) {
	e.preventDefault();
	const emailInput = e.target.querySelector("input");
	if (emailInput.value) {
		openSuccessModal(
			"Aramıza Hoş Geldin!",
			"Bülten listemize kaydın başarıyla alındı. Gelişmeleri seninle paylaşmak için sabırsızlanıyoruz."
		);
		emailInput.value = "";
	}
}

// bağış mantığı
let currentAmount = 0;

function selectAmount(amount) {
	document
		.querySelectorAll(".miktar-btn")
		.forEach((b) => b.classList.remove("aktif"));
	event.target.classList.add("aktif");
	document.getElementById("customAmount").value = amount;
	currentAmount = amount;
}

const modal = document.getElementById("paymentModal");
function openModal() {
	let val = document.getElementById("customAmount").value;
	if (!val || val <= 0) {
		if (currentAmount > 0) val = currentAmount;
		else {
			alert("Lütfen geçerli bir tutar giriniz.");
			return;
		}
	}
	currentAmount = val;
	document.getElementById("modalAmountDisplay").innerText = val;
	modal.style.display = "flex";
	setTimeout(() => modal.classList.add("modal-aktif"), 10);
}

function closeModal() {
	modal.classList.remove("modal-aktif");
	setTimeout(() => (modal.style.display = "none"), 300);
}

// ödeme işlemi
function processPayment() {
	const btn = document.querySelector(".modal-kart .cta-buton");
	const originalText = btn.innerHTML;
	btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> İşleniyor...';
	setTimeout(() => {
		closeModal();
		btn.innerHTML = originalText;

		// başarı modeli aç
		openSuccessModal(
			"Teşekkürler Kahraman!",
			currentAmount + " TL tutarındaki bağışınla bir umut ışığı daha yaktın."
		);

		document.getElementById("mainProgress").style.width = "88%";
	}, 1500);
}

// başarı modeli fonksiyonları
const successModal = document.getElementById("successModal");

function openSuccessModal(title, message) {
	document.getElementById("successTitle").innerText = title;
	document.getElementById("successMessage").innerText = message;
	successModal.style.display = "flex";
	setTimeout(() => successModal.classList.add("modal-aktif"), 10);
}

function closeSuccessModal() {
	successModal.classList.remove("modal-aktif");
	setTimeout(() => (successModal.style.display = "none"), 300);
}

function yukariCik() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// mobil menü
document.getElementById("menuBtn").addEventListener("click", () => {
	document.getElementById("navMenu").classList.toggle("aktif");
	const icon = document.querySelector("#menuBtn i");
	icon.classList.toggle("fa-bars");
	icon.classList.toggle("fa-times");
});

document.querySelectorAll(".nav-linkleri a").forEach((link) => {
	link.addEventListener("click", () => {
		document.getElementById("navMenu").classList.remove("aktif");
		const icon = document.querySelector("#menuBtn i");
		icon.classList.add("fa-bars");
		icon.classList.remove("fa-times");
	});
});

// sayfa yüklenince progress ve preloader
window.addEventListener("load", () => {
	// preloaderı hemen gizlemek yerine biraz beklet (2500ms = 2.5 saniye)
	setTimeout(() => {
		const preloader = document.getElementById("preloader");
		preloader.style.opacity = "0";
		preloader.style.visibility = "hidden";

		// progress bar animasyonu loader bittikten sonra başlasın
		setTimeout(() => {
			document.getElementById("mainProgress").style.width = "85%";
		}, 500);
	}, 2500); // yavaşlatılan süre

	// bildirimleri başlat
	setTimeout(showNotification, 4000);
});

// canlı bildirim mantığı
const names = [
	"Ayşe Y.",
	"Mehmet K.",
	"Zeynep S.",
	"Can B.",
	"Elif T.",
	"Murat D.",
	"Selin A.",
	"Berk O.",
];
const amounts = [50, 100, 250, 500, 1000, 20, 50];

function showNotification() {
	const notify = document.getElementById("liveNotify");
	if (!notify) return;

	const name = names[Math.floor(Math.random() * names.length)];
	const amount = amounts[Math.floor(Math.random() * amounts.length)];

	document.getElementById("notifyName").innerText = name;
	document.getElementById("notifyAmount").innerText = amount + " ₺";

	notify.classList.add("goster");

	// 4 saniye sonra gizle
	setTimeout(() => {
		notify.classList.remove("goster");
	}, 4000);

	// sonraki bildirim için rastgele süre (6-12 sn arası)
	setTimeout(showNotification, Math.random() * 6000 + 6000);
}
