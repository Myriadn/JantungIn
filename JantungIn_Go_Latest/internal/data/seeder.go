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
