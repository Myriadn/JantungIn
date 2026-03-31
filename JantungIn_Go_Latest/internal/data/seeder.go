package data

import (
	"context"
	"fmt"
	"log"
	"time"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/pkg/utils"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// doctorSeeds berisi data dokter dummy dengan variasi nama 1, 2, dan 3 kata
var doctorSeeds = []struct {
	name  string
	email string
}{
	// 3 kata
	{"Ahmad Fauzi Pratama", "dr.ahmadfauzipratama@jantungin.com"},
	{"Budi Santoso Wibowo", "dr.budisantosowibowo@jantungin.com"},
	{"Citra Dewi Anggraeni", "dr.citradewi.anggraeni@jantungin.com"},
	{"Dian Purnama Sari", "dr.dianpurnamasari@jantungin.com"},
	{"Eko Prasetyo Nugroho", "dr.ekoprasetyo.nugroho@jantungin.com"},
	{"Fajar Nugroho Santoso", "dr.fajarnugrohosantoso@jantungin.com"},
	{"Hendra Wijaya Kusuma", "dr.hendrawijayakusuma@jantungin.com"},
	{"Indah Lestari Putri", "dr.indahlestariputri@jantungin.com"},
	{"Kartini Sari Dewi", "dr.kartinisaridewi@jantungin.com"},
	{"Lukman Hakim Siregar", "dr.lukmanhakimsiregar@jantungin.com"},
	{"Maya Anggraeni Putri", "dr.mayaanggraeniputri@jantungin.com"},
	{"Nanda Pratama Putra", "dr.nandapratamamputra@jantungin.com"},
	{"Rizky Maulana Akbar", "dr.rizkymaulanaakbar@jantungin.com"},
	{"Sari Wulandari Ningrum", "dr.sariwulandari.ningrum@jantungin.com"},
	{"Teguh Santoso Prabowo", "dr.teguhsantosoprabowo@jantungin.com"},
	{"Wahyu Hidayat Saputra", "dr.wahyuhidayatsaputra@jantungin.com"},
	{"Zahra Amalia Fitri", "dr.zahraamaliafitri@jantungin.com"},
	{"Agus Kurniawan Setiawan", "dr.aguskurniawansetiawan@jantungin.com"},
	{"Bayu Prabowo Santoso", "dr.bayuprabowosantoso@jantungin.com"},
	{"Gilang Ramadhan Putra", "dr.gilangrmadhanputra@jantungin.com"},

	// 2 kata
	{"Gita Rahayu", "dr.gitarahayu@jantungin.com"},
	{"Joko Susilo", "dr.jokosusilo@jantungin.com"},
	{"Oka Setiawan", "dr.okasetiawan@jantungin.com"},
	{"Putri Handayani", "dr.putrihandayani@jantungin.com"},
	{"Qori Firdaus", "dr.qorifirdaus@jantungin.com"},
	{"Umi Kalsum", "dr.umikalsum@jantungin.com"},
	{"Vina Agustina", "dr.vinaagustina@jantungin.com"},
	{"Xenia Priyatno", "dr.xeniapriyatno@jantungin.com"},
	{"Yudi Hermawan", "dr.yudihermawan@jantungin.com"},
	{"Candra Kusuma", "dr.candrakusuma@jantungin.com"},
	{"Dewi Safitri", "dr.dewisafitri@jantungin.com"},
	{"Endang Suryani", "dr.endangsuryani@jantungin.com"},
	{"Firman Alamsyah", "dr.firmanalamsyah@jantungin.com"},
	{"Hesti Pertiwi", "dr.hestipertiwi@jantungin.com"},
	{"Ivan Kristanto", "dr.ivankristanto@jantungin.com"},
	{"Krisna Adiputra", "dr.krisnadiputra@jantungin.com"},
	{"Laras Setiabudi", "dr.larassetiabudi@jantungin.com"},
	{"Niken Ayu", "dr.nikenayu@jantungin.com"},
	{"Oscar Dermawan", "dr.oscardermawan@jantungin.com"},
	{"Prita Kusumawati", "dr.pritakusumawati@jantungin.com"},
	{"Silvana Maharani", "dr.silvanamaharani@jantungin.com"},
	{"Tri Hartono", "dr.trihartono@jantungin.com"},
	{"Vicky Ardiansyah", "dr.vickyardiansyah@jantungin.com"},
	{"Yoga Prayitno", "dr.yogaprayitno@jantungin.com"},
	{"Zulfan Arifin", "dr.zulfanarifin@jantungin.com"},

	// 1 kata
	{"Sukarno", "dr.sukarno@jantungin.com"},
	{"Suharto", "dr.suharto@jantungin.com"},
	{"Habibie", "dr.habibie@jantungin.com"},
	{"Megawati", "dr.megawati@jantungin.com"},
	{"Wiranto", "dr.wiranto@jantungin.com"},
}

// SeedDoctors menyisipkan 50 data dokter dummy ke database.
// Aman dijalankan berulang kali (idempotent) — skip jika email sudah ada.
func SeedDoctors(db *gorm.DB, cfg *utils.Config) error {
	encryptionKey := cfg.App.EncryptionKey
	defaultPassword := "dokter123"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal hash password: %w", err)
	}

	ctx := context.Background()
	skipped := 0
	inserted := 0
	failed := 0

	for i, seed := range doctorSeeds {
		// Cek apakah email sudah ada
		var existing entity.User
		err := db.WithContext(ctx).Where("email = ?", seed.email).First(&existing).Error
		if err == nil {
			skipped++
			continue
		}

		// NIK dummy: format 16 digit tepat
		// Prefix "8800" + 12 digit dari index agar unik dan tidak tabrakan dengan NIK asli
		nikPlain := fmt.Sprintf("8800%012d", i+1)

		encryptedNIK, err := utils.EncryptNIK(nikPlain, encryptionKey)
		if err != nil {
			log.Printf("[SEEDER] Gagal enkripsi NIK untuk %s: %v", seed.name, err)
			failed++
			continue
		}

		dob := birthDateFromIndex(i)
		emailCopy := seed.email

		doctor := entity.User{
			Name:         "dr. " + seed.name,
			Email:        &emailCopy,
			NIKEncrypted: encryptedNIK,
			Password:     string(hashedPassword),
			Role:         "dokter",
			DateOfBirth:  &dob,
		}

		if err := db.WithContext(ctx).Create(&doctor).Error; err != nil {
			log.Printf("[SEEDER] Gagal insert dokter %s: %v", seed.name, err)
			failed++
			continue
		}

		log.Printf("[SEEDER] Insert: dr. %s (%s)", seed.name, seed.email)
		inserted++
	}

	log.Printf("[SEEDER] Selesai: %d diinsert, %d dilewati (sudah ada), %d gagal", inserted, skipped, failed)
	return nil
}

// birthDateFromIndex menghasilkan tanggal lahir yang bervariasi dari index
func birthDateFromIndex(i int) time.Time {
	year := 1965 + (i % 25) // tahun lahir antara 1965-1989
	month := time.Month(1 + (i*3)%12)
	day := 1 + (i*7)%28
	return time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
}

// patientFirstNames - nama depan pasaran Indonesia
var patientFirstNames = []string{
	"Ahmad", "Budi", "Citra", "Dian", "Eka", "Fajar", "Gilang", "Hendra", "Indah", "Joko",
	"Kartini", "Lukman", "Maya", "Nanda", "Okta", "Putri", "Qori", "Rini", "Siti", "Teguh",
	"Umi", "Vina", "Wahyu", "Xenia", "Yani", "Zahra", "Agus", "Bayu", "Cahyo", "Dewi",
	"Endang", "Firman", "Gita", "Hesti", "Ivan", "Krisna", "Laras", "Mirah", "Niken", "Oscar",
	"Prita", "Reza", "Sari", "Tri", "Udin", "Vicky", "Wardi", "Yoga", "Zulfan", "Adinda",
}

var patientLastNames = []string{
	"Saputra", "Wijaya", "Hermawan", "Kusuma", "Rahman", "Handoko", "Santoso", "Pranoto", "Nugroho", "Prabowo",
	"Setiawan", "Hartono", "Gunawan", "Sutrisno", "Mulyadi", "Wibowo", "Suryadi", "Maulana", "Purwanto", "Kartini",
	"Rahayu", "Safitri", "Susandi", "Wahyuni", "Suryani", "Pratiwi", "Samsinar", "Hadiwijaya", "Siswanto", "Ermawan",
	"Suryana", "Sugito", "Putro", "Harsono", "Agustian", "Prayitno", "Subarno", "Budiman", "Darman", "Gunarto",
	"Haryanto", "Ibrahim", "Jumadi", "Kustarto", "Lismanto", "Mukhlas", "Narwanto", "Oerip", "Prasetya", "Rachmat",
}

// SeedPatients menyisipkan 100 data pasien dummy ke database.
// Age range: 20-55 tahun, mayoritas 25-30
func SeedPatients(db *gorm.DB, cfg *utils.Config) error {
	encryptionKey := cfg.App.EncryptionKey
	defaultPassword := "pasien123"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal hash password: %w", err)
	}

	ctx := context.Background()
	inserted := 0
	skipped := 0
	failed := 0

	for i := 0; i < 100; i++ {
		firstName := patientFirstNames[i%len(patientFirstNames)]
		lastName := patientLastNames[i%len(patientLastNames)]
		name := firstName + " " + lastName

		// Generate age: mayoritas 25-30, range 20-55
		age := generateAge(i)
		dob := time.Now().AddDate(-age, 0, 0)

		// Generate valid 16-digit NIK
		nikPlain := generateNIK(i)

		// Check jika NIK sudah ada
		var existing entity.User
		err := db.WithContext(ctx).Where("nik_encrypted LIKE ?", "%"+nikPlain[:4]+"%").First(&existing).Error
		if err == nil {
			skipped++
			continue
		}

		encryptedNIK, err := utils.EncryptNIK(nikPlain, encryptionKey)
		if err != nil {
			log.Printf("[SEEDER PATIENT] Gagal enkripsi NIK untuk %s: %v", name, err)
			failed++
			continue
		}

		patient := entity.User{
			Name:         name,
			Email:        nil,
			NIKEncrypted: encryptedNIK,
			Password:     string(hashedPassword),
			Role:         "user",
			DateOfBirth:  &dob,
		}

		if err := db.WithContext(ctx).Create(&patient).Error; err != nil {
			log.Printf("[SEEDER PATIENT] Gagal insert pasien %s: %v", name, err)
			failed++
			continue
		}

		inserted++
	}

	log.Printf("[SEEDER PATIENT] Selesai: %d diinsert, %d dilewati, %d gagal", inserted, skipped, failed)
	return nil
}

// generateAge menghasilkan umur mayoritas 25-30, range 20-55
func generateAge(index int) int {
	// 60% range 25-30
	if index%10 < 6 {
		return 25 + (index % 6) // 25-30
	}
	// 40% range lainnya: 20-24 dan 31-55
	if index%10 < 8 {
		return 20 + (index % 5) // 20-24
	}
	return 31 + (index % 25) // 31-55
}

// generateNIK menghasilkan NIK 16 digit yang terlihat valid
// Format: PPKKDDTTHH + 4 digit acak untuk identifikasi
func generateNIK(index int) string {
	// Province code (01-34), district, birth date, birth order
	// Simplified: gunakan format yang valid
	provCode := "33"                                    // Jawa Timur
	distCode := fmt.Sprintf("%02d", 10+(index%20))      // 10-29
	dateCode := fmt.Sprintf("%02d", 1+(index%28))       // 01-28
	monthCode := fmt.Sprintf("%02d", 1+(index%12))      // 01-12
	yearCode := fmt.Sprintf("%02d", 70+(index%30))      // 70-99
	orderCode := fmt.Sprintf("%04d", 1000+(index%9000)) // 1000-9999

	return provCode + distCode + dateCode + monthCode + yearCode + orderCode
}
