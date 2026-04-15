package data

import (
	"context"
	"fmt"
	"log"
	"math/rand/v2"
	"time"

	"jantungin-api-server/internal/data/entity"
	"jantungin-api-server/pkg/utils"

	"github.com/google/uuid"
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

	for i := range 100 {
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

// SeedDiagnoses menyisipkan 100 data diagnosa dummy ke database untuk pasien yang ada.
func SeedDiagnoses(db *gorm.DB, cfg *utils.Config) error {
	ctx := context.Background()

	// Ambil semua users dengan role = "user"
	var patients []entity.User
	if err := db.WithContext(ctx).Where("role = ?", "user").Find(&patients).Error; err != nil {
		return fmt.Errorf("gagal mengambil data pasien: %w", err)
	}

	if len(patients) == 0 {
		return fmt.Errorf("tidak ada pasien untuk diseed diagnosanya")
	}

	// Ambil dokter untuk CreatedBy (beberapa diagnosa dibuat oleh dokter)
	var doctors []entity.User
	db.WithContext(ctx).Where("role = ?", "dokter").Find(&doctors)

	var count int64
	db.WithContext(ctx).Model(&entity.Diagnosis{}).Count(&count)
	if count >= 100 {
		log.Printf("[SEEDER DIAGNOSIS] Dilewati: Sudah ada %d data diagnosa", count)
		return nil
	}

	inserted := 0
	failed := 0

	chestPainTypes := []string{"Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"}
	restingEcgResults := []string{"Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"}
	exerciseAngina := []string{"Ya", "Tidak"}
	stSegments := []string{"Upsloping", "Flat", "Downsloping"}
	thalassemiaTypes := []string{"Normal", "Fixed Defect", "Reversable Defect"}
	predictions := []string{"Berisiko", "Tidak Berisiko"}

	for range 100 {
		// Pilih random pasien menggunakan math/rand/v2
		patient := patients[rand.IntN(len(patients))]

		// 50% chance created by doctor, 50% self-diagnosis (null)
		var createdBy *uuid.UUID
		if len(doctors) > 0 && rand.Float32() > 0.5 {
			docID := doctors[rand.IntN(len(doctors))].ID
			createdBy = &docID
		}

		// Random date between 1 year ago and now
		randomDaysAgo := rand.IntN(365)
		createdAt := time.Now().AddDate(0, 0, -randomDaysAgo)

		// Determine age
		age := 0
		if patient.DateOfBirth != nil {
			age = int(time.Since(*patient.DateOfBirth).Hours() / 24 / 365)
		} else {
			age = rand.IntN(40) + 20 // default 20-60
		}

		sex := "Laki-laki"
		if rand.Float32() > 0.5 {
			sex = "Perempuan"
		}

		resultPercentage := 10.0 + float64(rand.Float32())*89.0 // 10.0 to 99.0

		cardioRisk := "Rendah"
		if resultPercentage > 75.0 {
			cardioRisk = "Tinggi"
		} else if resultPercentage > 40.0 {
			cardioRisk = "Sedang"
		}

		prediction := predictions[0] // Berisiko
		if resultPercentage < 50.0 {
			prediction = predictions[1] // Tidak Berisiko
		}

		diagnosis := entity.Diagnosis{
			UserID:                patient.ID,
			CreatedBy:             createdBy,
			Age:                   age,
			Sex:                   sex,
			ChestPainType:         chestPainTypes[rand.IntN(len(chestPainTypes))],
			RestingEcgResults:     restingEcgResults[rand.IntN(len(restingEcgResults))],
			FastingBloodSugar:     float64(rand.IntN(150) + 70), // 70-220
			RestingBloodPressure:  float64(rand.IntN(80) + 90),  // 90-170
			MaximumHeartRate:      rand.IntN(100) + 80,          // 80-180
			ExerciseInducedAngina: exerciseAngina[rand.IntN(len(exerciseAngina))],
			StSegment:             stSegments[rand.IntN(len(stSegments))],
			MajorVessels:          rand.IntN(4), // 0-3
			Thalassemia:           thalassemiaTypes[rand.IntN(len(thalassemiaTypes))],
			SerumCholesterol:      float64(rand.IntN(200) + 120), // 120-320
			StDepression:          float64(rand.Float32()) * 4.0, // 0.0-4.0
			ResultPercentage:      resultPercentage,
			CardiovascularRisk:    cardioRisk,
			Prediction:            prediction,
			CreatedAt:             createdAt,
			UpdatedAt:             createdAt,
		}

		if err := db.WithContext(ctx).Create(&diagnosis).Error; err != nil {
			log.Printf("[SEEDER DIAGNOSIS] Gagal insert diagnosa untuk pasien %s: %v", patient.Name, err)
			failed++
			continue
		}
		inserted++
	}

	log.Printf("[SEEDER DIAGNOSIS] Selesai: %d diinsert, %d gagal", inserted, failed)
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
