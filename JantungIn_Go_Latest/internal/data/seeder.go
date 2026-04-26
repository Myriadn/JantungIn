package data

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"log"
	"math/rand/v2"
	"strings"
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
func SeedDoctors(db *gorm.DB, cfg *utils.Config) error {
	defaultPassword := "dokter123"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal hash password: %w", err)
	}

	ctx := context.Background()
	skipped := 0
	inserted := 0
	failed := 0
	updated := 0

	for i, seed := range doctorSeeds {
		username := strings.Split(seed.email, "@")[0]

		// Cek apakah email sudah ada
		var existing entity.User
		err := db.WithContext(ctx).Where("email = ?", seed.email).First(&existing).Error
		if err == nil {
			// Update username jika masih kosong (untuk penambahan fitur skripsi)
			if existing.Username == nil || *existing.Username == "" {
				if err := db.WithContext(ctx).Model(&existing).Update("username", username).Error; err == nil {
					log.Printf("[SEEDER DOCTOR] Update username untuk %s -> %s", seed.name, username)
					updated++
				}
			}
			skipped++
			continue
		}

		dob := birthDateFromIndex(i)
		emailCopy := seed.email
		usernameCopy := username

		doctor := entity.User{
			Name:        "dr. " + seed.name,
			Username:    &usernameCopy,
			Email:       &emailCopy,
			Password:    string(hashedPassword),
			Role:        "dokter",
			DateOfBirth: &dob,
		}

		if err := db.WithContext(ctx).Create(&doctor).Error; err != nil {
			log.Printf("[SEEDER] Gagal insert dokter %s: %v", seed.name, err)
			failed++
			continue
		}

		log.Printf("[SEEDER] Insert: dr. %s (%s)", seed.name, seed.email)
		inserted++
	}

	log.Printf("[SEEDER] DOCTOR Selesai: %d diinsert, %d username diupdate, %d dilewati (sudah ada), %d gagal", inserted, updated, skipped-updated, failed)
	return nil
}

// birthDateFromIndex menghasilkan tanggal lahir yang bervariasi dari index
func birthDateFromIndex(i int) time.Time {
	year := 1965 + (i % 25)
	month := time.Month(1 + (i*3)%12)
	day := 1 + (i*7)%28
	return time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
}

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

var patientEmailDomains = []string{
	"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
}

// SeedPatients menyisipkan 100 data pasien dummy ke database dan membersihkan data yang bolong
func SeedPatients(db *gorm.DB, cfg *utils.Config) error {
	defaultPassword := "pasien123"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal hash password: %w", err)
	}

	ctx := context.Background()

	// SWEEP CLEANUP PASS:
	// Cari SEMUA pasien di database (Role = user) yang Email atau Username-nya masih kosong (termasuk hasil seeder lama yang terlewat)
	var usersTanpaEmailAtauUsername []entity.User
	db.WithContext(ctx).Where("role = ? AND (email IS NULL OR email = '' OR username IS NULL OR username = '')", "user").Find(&usersTanpaEmailAtauUsername)

	sweepUpdated := 0
	for _, u := range usersTanpaEmailAtauUsername {
		nameClean := strings.ToLower(strings.ReplaceAll(u.Name, " ", ""))
		// Karena nama mungkin ada duplikat di DB, tambahkan angka random biar username & emailnya unique
		randSuffix := rand.IntN(9999) + 1000

		emailDomain := patientEmailDomains[rand.IntN(len(patientEmailDomains))]

		newUsername := fmt.Sprintf("%s%d", nameClean, randSuffix)
		newEmail := fmt.Sprintf("%s@%s", newUsername, emailDomain)

		updates := map[string]interface{}{}
		if u.Email == nil || *u.Email == "" {
			updates["email"] = newEmail
		}
		if u.Username == nil || *u.Username == "" {
			updates["username"] = newUsername
		}

		if err := db.WithContext(ctx).Model(&u).Updates(updates).Error; err == nil {
			sweepUpdated++
		} else {
			log.Printf("[SEEDER PATIENT] Gagal update sweep untuk %s: %v", u.Name, err)
		}
	}
	if sweepUpdated > 0 {
		log.Printf("[SEEDER PATIENT] CLEANUP SWEEP: Berhasil memaksa update %d data pasien lama yang email/usernamenya kosong (null).", sweepUpdated)
	}

	inserted := 0
	skipped := 0
	failed := 0
	updated := 0

	for i := range 100 {
		firstName := patientFirstNames[i%len(patientFirstNames)]
		lastName := patientLastNames[i%len(patientLastNames)]
		name := firstName + " " + lastName

		// Generate random tapi konsisten email dan username pasien
		domain := patientEmailDomains[i%len(patientEmailDomains)]
		usernamePlain := fmt.Sprintf("%s.%s%d", strings.ToLower(firstName), strings.ToLower(lastName), i+1)
		emailPlain := fmt.Sprintf("%s@%s", usernamePlain, domain)

		// Generate age: mayoritas 25-30, range 20-55
		age := generateAge(i)
		dob := time.Now().AddDate(-age, 0, 0)

		// Check jika username sudah ada
		var existing entity.User
		err := db.WithContext(ctx).Where("username = ?", usernamePlain).First(&existing).Error
		if err == nil {
			updates := map[string]interface{}{}

			// Kalau user sudah ada, cek apakah email masih nil/kosong
			if existing.Email == nil || *existing.Email == "" {
				updates["email"] = emailPlain
			}

			// Cek juga username untuk keperluan skripsi
			if existing.Username == nil || *existing.Username == "" {
				updates["username"] = usernamePlain
			}

			// Update jika ada field yang kurang
			if len(updates) > 0 {
				if err := db.WithContext(ctx).Model(&existing).Updates(updates).Error; err == nil {
					log.Printf("[SEEDER PATIENT] Update data untuk %s -> Username: %s, Email: %s", name, usernamePlain, emailPlain)
					updated++
				}
			}
			skipped++
			continue
		}

		patient := entity.User{
			Name:        name,
			Username:    &usernamePlain,
			Email:       &emailPlain,
			Password:    string(hashedPassword),
			Role:        "user",
			DateOfBirth: &dob,
		}

		if err := db.WithContext(ctx).Create(&patient).Error; err != nil {
			log.Printf("[SEEDER PATIENT] Gagal insert pasien %s: %v", name, err)
			failed++
			continue
		}

		inserted++
	}

	log.Printf("[SEEDER PATIENT] Selesai: %d diinsert, %d data diupdate (email/username), %d dilewati lengkap, %d gagal", inserted, updated, skipped-updated, failed)
	return nil
}

// SeedDiagnoses menyisipkan 300 data diagnosa dummy ke database untuk pasien yang ada.
func SeedDiagnoses(db *gorm.DB, cfg *utils.Config) error {
	ctx := context.Background()

	var patients []entity.User
	if err := db.WithContext(ctx).Where("role = ?", "user").Find(&patients).Error; err != nil {
		return fmt.Errorf("gagal mengambil data pasien: %w", err)
	}

	if len(patients) == 0 {
		return fmt.Errorf("tidak ada pasien untuk diseed diagnosanya")
	}

	var doctors []entity.User
	db.WithContext(ctx).Where("role = ?", "dokter").Find(&doctors)

	// SWEEP CLEANUP PASS UNTUK DIAGNOSA (Fix CreatedBy = NULL)
	var nullDiagnoses []entity.Diagnosis
	db.WithContext(ctx).Where("created_by IS NULL").Find(&nullDiagnoses)
	if len(nullDiagnoses) > 0 && len(doctors) > 0 {
		updatedSweep := 0
		for _, d := range nullDiagnoses {
			docID := doctors[rand.IntN(len(doctors))].ID
			if err := db.WithContext(ctx).Model(&d).Update("created_by", docID).Error; err == nil {
				updatedSweep++
			}
		}
		log.Printf("[SEEDER DIAGNOSIS] CLEANUP SWEEP: Berhasil mengupdate %d data diagnosa yang created_by-nya null.", updatedSweep)
	}

	var count int64
	db.WithContext(ctx).Model(&entity.Diagnosis{}).Count(&count)

	targetTotal := 300 // Target total data diagnosa yang diinginkan
	if count >= int64(targetTotal) {
		log.Printf("[SEEDER DIAGNOSIS] Dilewati: Sudah ada %d data diagnosa", count)
		return nil
	}

	needed := targetTotal - int(count)
	inserted := 0
	failed := 0

	chestPainTypes := []string{"Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"}
	restingEcgResults := []string{"Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"}
	exerciseAngina := []string{"Ya", "Tidak"}
	stSegments := []string{"Upsloping", "Flat", "Downsloping"}
	thalassemiaTypes := []string{"Normal", "Fixed Defect", "Reversable Defect"}
	predictions := []string{"Berisiko", "Tidak Berisiko"}

	for range needed {
		patient := patients[rand.IntN(len(patients))]

		// Sekarang SELALU diisi oleh dokter (TIDAK NULL) sesuai request
		var createdBy *uuid.UUID
		if len(doctors) > 0 {
			docID := doctors[rand.IntN(len(doctors))].ID
			createdBy = &docID
		}

		randomDaysAgo := rand.IntN(365)
		createdAt := time.Now().AddDate(0, 0, -randomDaysAgo)

		age := 0
		if patient.DateOfBirth != nil {
			age = int(time.Since(*patient.DateOfBirth).Hours() / 24 / 365)
		} else {
			age = rand.IntN(40) + 20
		}

		sex := "Laki-laki"
		if rand.Float32() > 0.5 {
			sex = "Perempuan"
		}

		resultPercentage := 10.0 + float64(rand.Float32())*89.0

		cardioRisk := "Rendah"
		if resultPercentage > 75.0 {
			cardioRisk = "Tinggi"
		} else if resultPercentage > 40.0 {
			cardioRisk = "Sedang"
		}

		prediction := predictions[0]
		if resultPercentage < 50.0 {
			prediction = predictions[1]
		}

		diagnosis := entity.Diagnosis{
			UserID:                patient.ID,
			CreatedBy:             createdBy,
			Age:                   age,
			Sex:                   sex,
			ChestPainType:         chestPainTypes[rand.IntN(len(chestPainTypes))],
			RestingEcgResults:     restingEcgResults[rand.IntN(len(restingEcgResults))],
			FastingBloodSugar:     float64(rand.IntN(150) + 70),
			RestingBloodPressure:  float64(rand.IntN(80) + 90),
			MaximumHeartRate:      rand.IntN(100) + 80,
			ExerciseInducedAngina: exerciseAngina[rand.IntN(len(exerciseAngina))],
			StSegment:             stSegments[rand.IntN(len(stSegments))],
			MajorVessels:          rand.IntN(4),
			Thalassemia:           thalassemiaTypes[rand.IntN(len(thalassemiaTypes))],
			SerumCholesterol:      float64(rand.IntN(200) + 120),
			StDepression:          float64(rand.Float32()) * 4.0,
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

// SeedUserDevices menyisipkan data dummy perangkat untuk setiap user.
// Setiap user akan memiliki 1 hingga 3 perangkat dengan tipe perangkat yang populer di Indonesia.
func SeedUserDevices(db *gorm.DB, cfg *utils.Config) error {
	ctx := context.Background()

	var users []entity.User
	if err := db.WithContext(ctx).Where("role = ?", "user").Find(&users).Error; err != nil {
		return fmt.Errorf("gagal mengambil data user: %w", err)
	}

	if len(users) == 0 {
		log.Printf("[SEEDER DEVICES] Dilewati: Tidak ada user untuk diseed devices-nya")
		return nil
	}

	var existingDevicesCount int64
	db.WithContext(ctx).Model(&entity.UserDevice{}).Count(&existingDevicesCount)
	if existingDevicesCount >= int64(len(users)) {
		log.Printf("[SEEDER DEVICES] Dilewati: Sudah ada data user_devices (Total: %d)", existingDevicesCount)
		return nil
	}

	// Distribusi device populer di Indonesia (mayoritas Android)
	devicePool := []string{
		// Androids (Mayoritas)
		"Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (Linux; Android 11; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36",

		// iOS
		"Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",

		// Windows
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
	}

	ipPool := []string{
		"192.168.1", "192.168.0", "203.0.113", "10.0.0", "172.16.0",
		"114.124.0", "180.252.0", "120.188.0", "36.68.0", "140.213.0",
	}

	inserted := 0

	for _, u := range users {
		// Cek apakah user ini sudah punya device
		var count int64
		db.WithContext(ctx).Model(&entity.UserDevice{}).Where("user_id = ?", u.ID).Count(&count)
		if count > 0 {
			continue // Skip jika sudah ada agar tidak duplikat
		}

		// Menentukan jumlah device untuk user ini:
		// 70% punya 1 device, 20% punya 2 device, 10% punya 3 device
		numDevices := 1
		prob := rand.Float32()
		if prob > 0.90 {
			numDevices = 3
		} else if prob > 0.70 {
			numDevices = 2
		}

		for j := 0; j < numDevices; j++ {
			ua := devicePool[rand.IntN(len(devicePool))]
			ip := ipPool[rand.IntN(len(ipPool))]

			// Buat fingerprint mirip SQL: md5(user_id::text || '|' || user_agent || '|' || ip_address)
			rawString := fmt.Sprintf("%s|%s|%s", u.ID.String(), ua, ip)
			hashBytes := md5.Sum([]byte(rawString))
			fingerprint := hex.EncodeToString(hashBytes[:])

			lastLogin := time.Now().Add(-time.Duration(rand.IntN(720)) * time.Hour) // random waktu lalu

			device := entity.UserDevice{
				UserID:            u.ID,
				UserAgent:         ua,
				IPAddress:         ip,
				DeviceFingerprint: fingerprint,
				LastLogin:         lastLogin,
				CreatedAt:         lastLogin,
				UpdatedAt:         lastLogin,
			}

			if err := db.WithContext(ctx).Create(&device).Error; err == nil {
				inserted++
			}
		}
	}

	log.Printf("[SEEDER DEVICES] Selesai: %d devices diinsert", inserted)
	return nil
}

func generateAge(index int) int {
	if index%10 < 6 {
		return 25 + (index % 6)
	}
	if index%10 < 8 {
		return 20 + (index % 5)
	}
	return 31 + (index % 25)
}
