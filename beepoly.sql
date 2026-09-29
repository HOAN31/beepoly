
Enum "vai_tro_nguoi_dung" {
  "hoc_vien"
  "phu_huynh"
  "giang_vien"
  "quan_tri_vien"
}

Enum "che_do_giao_dien" {
  "mac_dinh"
  "tre_em"
  "chuyen_nghiep"
}

Enum "loai_giong" {
  "tieng_anh_anh"
  "tieng_anh_my"
}

Enum "trinh_do_cefr" {
  "A1"
  "A2"
  "B1"
  "B2"
  "C1"
  "C2"
}

Enum "ky_nang" {
  "nghe"
  "noi"
  "doc"
  "viet"
}

Enum "loai_noi_dung" {
  "video"
  "am_thanh"
  "text"
}

Enum "loai_ky_thi" {
  "TOEIC"
  "IELTS"
}

Enum "loai_cau_hoi" {
  "trac_nghiem"
  "dien_vao_cho_trong"
  "noi"
  "viet"
}

Enum "nha_cung_cap_dang_nhap" {
  "google"
  "apple"
  "facebook"
  "email"
}

Enum "che_do_ai" {
  "tranh_bien"
  "mo_phong_thi"
  "tro_giang"
}

Enum "vai_tro_tin_nhan" {
  "nguoi_dung"
  "tro_ly"
  "he_thong"
}

Enum "trang_thai_goi_dang_ky" {
  "dang_hoat_dong"
  "het_han"
  "da_huy"
  "dung_thu"
}

Enum "trang_thai_thanh_toan" {
  "cho_xu_ly"
  "da_thanh_toan"
  "that_bai"
  "hoan_tien"
}

Table "nguoi_dung" {
  "id" BIGINT [pk, increment]
  "email" VARCHAR(255) [unique, not null]
  "mat_khau_ma_hoa" VARCHAR(255)
  "ho_ten" VARCHAR(150) [not null]
  "ngay_sinh" DATE
  "vai_tro" vai_tro_nguoi_dung [not null, default: 'hoc_vien']
  "che_do_giao_dien" che_do_giao_dien [not null, default: 'mac_dinh']
  "che_do_toi" BOOLEAN [not null, default: false]
  "co_chu_lon" BOOLEAN [not null, default: false]
  "giong_tieng_anh_uu_tien" loai_giong [not null, default: 'tieng_anh_my']
  "trinh_do_hien_tai" trinh_do_cefr
  "trinh_do_muc_tieu" trinh_do_cefr
  "ma_quoc_gia" CHAR(2)
  "trang_thai" VARCHAR(20) [not null, default: 'dang_hoat_dong']
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]
  "lan_dang_nhap_cuoi" TIMESTAMPTZ

  Indexes {
    vai_tro [name: "idx_nguoi_dung_vai_tro"]
  }
}

Table "tai_khoan_dang_nhap" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "nha_cung_cap" nha_cung_cap_dang_nhap [not null]
  "ma_tai_khoan_nha_cung_cap" VARCHAR(255) [not null]
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Indexes {
    (nha_cung_cap, ma_tai_khoan_nha_cung_cap) [unique, name: "uq_tai_khoan_dang_nhap_nha_cung_cap_ma_tai_khoan_nha_cung_cap"]
    nguoi_dung_id [name: "idx_tai_khoan_dang_nhap_nguoi_dung_id"]
    (nguoi_dung_id, nha_cung_cap) [unique, name: "uq_tai_khoan_nguoi_dung_nha_cung_cap"]
  }
}

Table "quan_he_gia_dinh" {
  "id" BIGINT [pk, increment]
  "id_phu_huynh" BIGINT [not null]
  "id_con" BIGINT [not null]
  "gioi_han_hang_ngay_phut" INTEGER
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `gioi_han_hang_ngay_phut IS NULL OR (gioi_han_hang_ngay_phut >= 0 AND gioi_han_hang_ngay_phut <= 1440)` [name: 'check_quan_he_gia_dinh_gioi_han']
  }

  Indexes {
    (id_phu_huynh, id_con) [unique, name: "uq_quan_he_gia_dinh_id_phu_huynh_id_con"]
  }
}

Table "khoa_hoc" {
  "id" BIGINT [pk, increment]
  "tieu_de" VARCHAR(200) [not null]
  "mo_ta" TEXT
  "trinh_do_cefr" trinh_do_cefr [not null]
  "la_goi_cao_cap" BOOLEAN [not null, default: false]
  "da_xuat_ban" BOOLEAN [not null, default: false]
  "nguoi_tao_id" BIGINT
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Indexes {
    trinh_do_cefr [name: "idx_khoa_hoc_trinh_do_cefr"]
  }
}

Table "bai_hoc" {
  "id" BIGINT [pk, increment]
  "khoa_hoc_id" BIGINT [not null]
  "tieu_de" VARCHAR(200) [not null]
  "thu_tu" INTEGER [not null]
  "ky_nang" ky_nang
  "thoi_luong_phut" INTEGER

  Checks {
    `thu_tu > 0` [name: 'check_bai_hoc_thu_tu']
  }

  Indexes {
    (khoa_hoc_id, thu_tu) [unique, name: "uq_bai_hoc_khoa_hoc_id_thu_tu"]
    ky_nang [name: "idx_bai_hoc_ky_nang"]
  }
}

Table "noi_dung_bai_hoc" {
  "id" BIGINT [pk, increment]
  "bai_hoc_id" BIGINT [not null]
  "loai" loai_noi_dung [not null]
  "duong_dan_media" VARCHAR(500)
  "noi_dung_van_ban" TEXT
  "duong_dan_phu_de" VARCHAR(500)
  "thu_tu" INTEGER
}

Table "dang_ky_khoa_hoc" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "khoa_hoc_id" BIGINT [not null]
  "ngay_dang_ky" TIMESTAMPTZ [not null, default: `now()`]
  "ngay_hoan_thanh" TIMESTAMPTZ

  Indexes {
    (nguoi_dung_id, khoa_hoc_id) [unique, name: "uq_dang_ky_khoa_hoc_nguoi_dung_id_khoa_hoc_id"]
  }
}

Table "tien_do_bai_hoc" {
  "nguoi_dung_id" BIGINT [not null]
  "bai_hoc_id" BIGINT [not null]
  "phan_tram_hoan_thanh" SMALLINT [not null, default: 0]
  "diem_so" NUMERIC(5,2)
  "thoi_gian_hoc_giay" INTEGER [not null, default: 0]
  "lan_truy_cap_cuoi" TIMESTAMPTZ

  Indexes {
    (nguoi_dung_id, bai_hoc_id) [pk]
    (nguoi_dung_id, bai_hoc_id) [name: "idx_tien_do_bai_hoc_user_id_lesson_id"]
  }
}

Table "chu_de_ngu_phap" {
  "id" BIGINT [pk, increment]
  "ten" VARCHAR(150) [not null]
  "trinh_do_cefr" trinh_do_cefr
}

Table "ky_thi" {
  "id" BIGINT [pk, increment]
  "loai" loai_ky_thi [not null]
  "tieu_de" VARCHAR(200) [not null]
  "gioi_han_thoi_gian_phut" INTEGER [not null]
  "la_goi_cao_cap" BOOLEAN [not null, default: false]

  Checks {
    `gioi_han_thoi_gian_phut > 0` [name: 'check_ky_thi_thoi_gian']
  }
}

Table "phan_thi" {
  "id" BIGINT [pk, increment]
  "ky_thi_id" BIGINT [not null]
  "ky_nang" ky_nang [not null]
  "thu_tu" INTEGER
  "gioi_han_thoi_gian_phut" INTEGER
}

Table "cau_hoi" {
  "id" BIGINT [pk, increment]
  "phan_thi_id" BIGINT [not null]
  "chu_de_ngu_phap_id" BIGINT
  "loai" loai_cau_hoi [not null]
  "noi_dung" TEXT [not null]
  "duong_dan_media" VARCHAR(500)
  "dap_an_dung" TEXT
  "giai_thich" TEXT
  "diem" NUMERIC(5,2) [not null, default: 1]

  Checks {
    `diem > 0` [name: 'check_cau_hoi_diem']
  }

  Indexes {
    loai [name: "idx_cau_hoi_loai"]
  }
}

Table "lua_chon_cau_hoi" {
  "id" BIGINT [pk, increment]
  "cau_hoi_id" BIGINT [not null]
  "nhan" CHAR(1)
  "noi_dung" TEXT
  "la_dap_an_dung" BOOLEAN [not null, default: false]
}

Table "lan_thi" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "ky_thi_id" BIGINT [not null]
  "bat_dau_luc" TIMESTAMPTZ [not null, default: `now()`]
  "ngay_nop" TIMESTAMPTZ
  "total_score" NUMERIC(6,2)
  "listening_score" NUMERIC(5,2)
  "reading_score" NUMERIC(5,2)
  "speaking_score" NUMERIC(4,2)
  "writing_score" NUMERIC(4,2)

  Checks {
    `ngay_nop IS NULL OR ngay_nop >= bat_dau_luc` [name: 'check_lan_thi_ngay_nop']
    `(total_score IS NULL OR total_score >= 0) AND (listening_score IS NULL OR listening_score >= 0) AND (reading_score IS NULL OR reading_score >= 0) AND (speaking_score IS NULL OR speaking_score >= 0) AND (writing_score IS NULL OR writing_score >= 0)` [name: 'check_lan_thi_diem']
  }

  Indexes {
    (nguoi_dung_id, bat_dau_luc) [name: "idx_lan_thi_user_id_started_at"]
  }
}

Table "cau_tra_loi_lan_thi" {
  "id" BIGINT [pk, increment]
  "lan_thi_id" BIGINT [not null]
  "cau_hoi_id" BIGINT [not null]
  "lua_chon_id" BIGINT
  "cau_tra_loi" TEXT
  "duong_dan_am_thanh" VARCHAR(500)
  "la_dap_an_dung" BOOLEAN
  "diem_ai" NUMERIC(5,2)
  "nhan_xet_ai" TEXT

  Indexes {
    (lan_thi_id, cau_hoi_id) [unique, name: "uq_cau_tra_loi_lan_thi_lan_thi_id_cau_hoi_id"]
  }
}

Table "lan_luyen_phat_am" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "bai_hoc_id" BIGINT
  "van_ban_mau" TEXT [not null]
  "giong" loai_giong [not null]
  "duong_dan_am_thanh" VARCHAR(500)
  "diem_tuong_dong" NUMERIC(5,2)
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `diem_tuong_dong IS NULL OR (diem_tuong_dong >= 0 AND diem_tuong_dong <= 100)` [name: 'check_lan_luyen_phat_am_diem']
  }

  Indexes {
    (nguoi_dung_id, ngay_tao) [name: "idx_lan_luyen_phat_am_user_id_created_at"]
  }
}

Table "loi_phat_am" {
  "id" BIGINT [pk, increment]
  "lan_thi_id" BIGINT [not null]
  "tu" VARCHAR(100)
  "am_vi" VARCHAR(20)
  "loi_trong_am" BOOLEAN [not null, default: false]
  "goi_y" TEXT
}

Table "cuoc_tro_chuyen_ai" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "che_do" che_do_ai [not null]
  "chu_de" VARCHAR(200)
  "tu_vung_muc_tieu" JSONB
  "diem_cuoi" NUMERIC(4,2)
  "bat_dau_luc" TIMESTAMPTZ [not null, default: `now()`]
  "ket_thuc_luc" TIMESTAMPTZ

  Indexes {
    (nguoi_dung_id, bat_dau_luc) [name: "idx_cuoc_tro_chuyen_ai_user_id_started_at"]
    che_do [name: "idx_cuoc_tro_chuyen_ai_che_do"]
    tu_vung_muc_tieu [type: gin, name: "idx_cuoc_tro_chuyen_ai_tu_vung"]
  }
}

Table "tin_nhan_ai" {
  "id" BIGINT [pk, increment]
  "cuoc_tro_chuyen_id" BIGINT [not null]
  "vai_tro" vai_tro_tin_nhan [not null]
  "noi_dung" TEXT
  "duong_dan_am_thanh" VARCHAR(500)
  "la_cau_hoi_tiep_theo" BOOLEAN [not null, default: false]
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Indexes {
    (cuoc_tro_chuyen_id, ngay_tao) [name: "idx_tin_nhan_ai_conversation_id_created_at"]
    vai_tro [name: "idx_tin_nhan_ai_vai_tro"]
  }
}

Table "bo_the_tu_vung" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "tieu_de" VARCHAR(200)
  "source_pdf_url" VARCHAR(500)
  "is_auto_generated" BOOLEAN [not null, default: false]
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]
}

Table "the_tu_vung" {
  "id" BIGINT [pk, increment]
  "bo_the_id" BIGINT [not null]
  "tu" VARCHAR(150) [not null]
  "nghia" TEXT
  "vi_du" TEXT
  "duong_dan_am_thanh" VARCHAR(500)

  Indexes {
    bo_the_id [name: "idx_the_tu_vung_bo_the_id"]
  }
}

Table "lich_su_on_the" {
  "nguoi_dung_id" BIGINT [not null]
  "flashcard_id" BIGINT [not null]
  "he_so_do_de" NUMERIC(3,2) [not null, default: 2.5]
  "khoang_cach_ngay" INTEGER [not null, default: 1]
  "lan_on_tiep_theo" TIMESTAMPTZ
  "so_lan_sai" INTEGER [not null, default: 0]

  Indexes {
    (nguoi_dung_id, flashcard_id) [pk]
    (nguoi_dung_id, flashcard_id) [name: "idx_lich_su_on_the_user_id_flashcard_id"]
    (nguoi_dung_id, lan_on_tiep_theo) [name: "idx_lich_su_on_the_user_id_next_review_at"]
    lan_on_tiep_theo [name: "idx_lich_su_on_the_ngay_on"]
  }
}

Table "diem_yeu_ngu_phap" {
  "nguoi_dung_id" BIGINT [not null]
  "chu_de_ngu_phap_id" BIGINT [not null]
  "so_lan_sai" INTEGER [not null, default: 0]
  "lan_sai_cuoi" TIMESTAMPTZ

  Indexes {
    (nguoi_dung_id, chu_de_ngu_phap_id) [name: "idx_diem_yeu_ngu_phap_user_id_grammar_topic_id"]
    (nguoi_dung_id, so_lan_sai) [name: "idx_diem_yeu_ngu_phap_so_lan_sai"]
  }
}

Table "lop_hoc" {
  "id" BIGINT [pk, increment]
  "giang_vien_id" BIGINT [not null]
  "ten" VARCHAR(200) [not null]
  "ma_tham_gia" VARCHAR(12) [unique, not null]
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `ma_tham_gia ~ '^[A-Za-z0-9]{6,12}$'` [name: 'check_lop_hoc_ma_tham_gia']
  }
}

Table "thanh_vien_lop" {
  "lop_hoc_id" BIGINT [not null]
  "nguoi_dung_id" BIGINT [not null]
  "ngay_tham_gia" TIMESTAMPTZ [not null, default: `now()`]

  Indexes {
    (lop_hoc_id, nguoi_dung_id) [pk]
    (lop_hoc_id, nguoi_dung_id) [name: "idx_thanh_vien_lop_class_id_user_id"]
  }
}

Table "bai_nop_viet" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "lop_hoc_id" BIGINT
  "noi_dung" TEXT [not null]
  "diem_ai" NUMERIC(4,2)
  "goi_y_ai" TEXT
  "giang_vien_id" BIGINT
  "diem_cuoi" NUMERIC(4,2)
  "nhan_xet_giang_vien" TEXT
  "ngay_nop" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `(diem_ai IS NULL OR (diem_ai >= 0 AND diem_ai <= 10)) AND (diem_cuoi IS NULL OR (diem_cuoi >= 0 AND diem_cuoi <= 10))` [name: 'check_bai_nop_viet_diem']
  }
}

Table "thong_ke_nguoi_dung" {
  "nguoi_dung_id" BIGINT [pk]
  "tong_kinh_nghiem" BIGINT [not null, default: 0]
  "chuoi_hoc_hien_tai" INTEGER [not null, default: 0]
  "chuoi_hoc_dai_nhat" INTEGER [not null, default: 0]
  "ngay_hoc_cuoi" DATE

  Checks {
    `tong_kinh_nghiem >= 0 AND chuoi_hoc_hien_tai >= 0 AND chuoi_hoc_dai_nhat >= 0` [name: 'check_thong_ke_nguoi_dung']
  }
}

Table "goi_dich_vu" {
  "id" BIGINT [pk, increment]
  "ten" VARCHAR(100) [not null]
  "thoi_han_ngay" INTEGER
  "gia" NUMERIC(12,2) [not null]
  "don_vi_tien_te" CHAR(3) [not null, default: 'VND']
  "dang_hoat_dong" BOOLEAN [not null, default: true]

  Checks {
    `gia > 0` [name: 'check_goi_dich_vu_gia']
  }
}

Table "goi_dang_ky" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "goi_dich_vu_id" BIGINT [not null]
  "trang_thai" trang_thai_goi_dang_ky [not null, default: 'dang_hoat_dong']
  "bat_dau_luc" TIMESTAMPTZ
  "ket_thuc_luc" TIMESTAMPTZ

  Indexes {
    (nguoi_dung_id, trang_thai) [name: "idx_goi_dang_ky_user_id_status"]
    (nguoi_dung_id, goi_dich_vu_id) [unique, name: "uq_goi_dang_ky_hoat_dong"]
  }
}

Table "thanh_toan" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "goi_dang_ky_id" BIGINT
  "nha_cung_cap" VARCHAR(30)
  "so_tien" NUMERIC(12,2) [not null]
  "don_vi_tien_te" CHAR(3)
  "trang_thai" trang_thai_thanh_toan [not null, default: 'cho_xu_ly']
  "ma_giao_dich" VARCHAR(120)
  "thanh_toan_luc" TIMESTAMPTZ
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `so_tien >= 0` [name: 'check_thanh_toan_so_tien']
  }

  Indexes {
    (nguoi_dung_id, ngay_tao) [name: "idx_thanh_toan_user_id_created_at"]
    (nha_cung_cap, ma_giao_dich) [unique, name: "uq_payments_provider_ref"]
    trang_thai [name: "idx_thanh_toan_trang_thai"]
  }
}

Table "phien_hoc" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "bat_dau_luc" TIMESTAMPTZ [not null]
  "ket_thuc_luc" TIMESTAMPTZ
  "duration_sec" INTEGER
  "gio_trong_ngay" SMALLINT

  Checks {
    `gio_trong_ngay BETWEEN 0 AND 23` [name: 'ck_phien_hoc_gio']
    `ket_thuc_luc IS NULL OR ket_thuc_luc > bat_dau_luc` [name: 'check_phien_hoc_thoi_gian']
  }

  Indexes {
    (nguoi_dung_id, bat_dau_luc) [name: "idx_phien_hoc_user_id_started_at"]
  }
}

Table "diem_ky_nang" {
  "id" BIGINT [pk, increment]
  "nguoi_dung_id" BIGINT [not null]
  "listening" NUMERIC(5,2)
  "speaking" NUMERIC(5,2)
  "reading" NUMERIC(5,2)
  "writing" NUMERIC(5,2)
  "ngay_ghi_nhan" DATE [not null]

  Checks {
    `(listening IS NULL OR (listening >= 0 AND listening <= 100)) AND (speaking IS NULL OR (speaking >= 0 AND speaking <= 100)) AND (reading IS NULL OR (reading >= 0 AND reading <= 100)) AND (writing IS NULL OR (writing >= 0 AND writing <= 100))` [name: 'check_diem_ky_nang']
  }

  Indexes {
    (nguoi_dung_id, ngay_ghi_nhan) [unique, name: "uq_diem_ky_nang_nguoi_dung_id_ngay_ghi_nhan"]
  }
}

Ref "fk_tai_khoan_dang_nhap_nguoi_dung_id":"nguoi_dung"."id" <? "tai_khoan_dang_nhap"."nguoi_dung_id"

Ref "fk_quan_he_gia_dinh_id_phu_huynh":"nguoi_dung"."id" <? "quan_he_gia_dinh"."id_phu_huynh"

Ref "fk_quan_he_gia_dinh_id_con":"nguoi_dung"."id" <? "quan_he_gia_dinh"."id_con"

Ref "fk_khoa_hoc_nguoi_tao_id":"nguoi_dung"."id" ?<? "khoa_hoc"."nguoi_tao_id"

Ref "fk_bai_hoc_khoa_hoc_id":"khoa_hoc"."id" <? "bai_hoc"."khoa_hoc_id"

Ref "fk_noi_dung_bai_hoc_bai_hoc_id":"bai_hoc"."id" <? "noi_dung_bai_hoc"."bai_hoc_id"

Ref "fk_dang_ky_khoa_hoc_nguoi_dung_id":"nguoi_dung"."id" <? "dang_ky_khoa_hoc"."nguoi_dung_id"

Ref "fk_dang_ky_khoa_hoc_khoa_hoc_id":"khoa_hoc"."id" <? "dang_ky_khoa_hoc"."khoa_hoc_id"

Ref "fk_tien_do_bai_hoc_nguoi_dung_id":"nguoi_dung"."id" <? "tien_do_bai_hoc"."nguoi_dung_id"

Ref "fk_tien_do_bai_hoc_bai_hoc_id":"bai_hoc"."id" <? "tien_do_bai_hoc"."bai_hoc_id"

Ref "fk_cau_hoi_chu_de_ngu_phap_id":"chu_de_ngu_phap"."id" ?<? "cau_hoi"."chu_de_ngu_phap_id"

Ref "fk_phan_thi_ky_thi_id":"ky_thi"."id" <? "phan_thi"."ky_thi_id"

Ref "fk_cau_hoi_phan_thi_id":"phan_thi"."id" <? "cau_hoi"."phan_thi_id"

Ref "fk_lua_chon_cau_hoi_cau_hoi_id":"cau_hoi"."id" <? "lua_chon_cau_hoi"."cau_hoi_id"

Ref "fk_lan_thi_nguoi_dung_id":"nguoi_dung"."id" <? "lan_thi"."nguoi_dung_id"

Ref "fk_lan_thi_ky_thi_id":"ky_thi"."id" <? "lan_thi"."ky_thi_id"

Ref "fk_cau_tra_loi_lan_thi_lan_thi_id":"lan_thi"."id" <? "cau_tra_loi_lan_thi"."lan_thi_id"

Ref "fk_cau_tra_loi_lan_thi_cau_hoi_id":"cau_hoi"."id" <? "cau_tra_loi_lan_thi"."cau_hoi_id"

Ref "fk_cau_tra_loi_lan_thi_lua_chon_id":"lua_chon_cau_hoi"."id" ?<? "cau_tra_loi_lan_thi"."lua_chon_id"

Ref "fk_lan_luyen_phat_am_nguoi_dung_id":"nguoi_dung"."id" <? "lan_luyen_phat_am"."nguoi_dung_id"

Ref "fk_lan_luyen_phat_am_bai_hoc_id":"bai_hoc"."id" ?<? "lan_luyen_phat_am"."bai_hoc_id"

Ref "fk_loi_phat_am_lan_thi_id":"lan_luyen_phat_am"."id" <? "loi_phat_am"."lan_thi_id"

Ref "fk_cuoc_tro_chuyen_ai_nguoi_dung_id":"nguoi_dung"."id" <? "cuoc_tro_chuyen_ai"."nguoi_dung_id"

Ref "fk_tin_nhan_ai_cuoc_tro_chuyen_id":"cuoc_tro_chuyen_ai"."id" <? "tin_nhan_ai"."cuoc_tro_chuyen_id"

Ref "fk_bo_the_tu_vung_nguoi_dung_id":"nguoi_dung"."id" <? "bo_the_tu_vung"."nguoi_dung_id"

Ref "fk_the_tu_vung_bo_the_id":"bo_the_tu_vung"."id" <? "the_tu_vung"."bo_the_id"

Ref "fk_lich_su_on_the_nguoi_dung_id":"nguoi_dung"."id" <? "lich_su_on_the"."nguoi_dung_id"

Ref "fk_lich_su_on_the_flashcard_id":"the_tu_vung"."id" <? "lich_su_on_the"."flashcard_id"

Ref "fk_diem_yeu_ngu_phap_nguoi_dung_id":"nguoi_dung"."id" <? "diem_yeu_ngu_phap"."nguoi_dung_id"

Ref "fk_diem_yeu_ngu_phap_chu_de_ngu_phap_id":"chu_de_ngu_phap"."id" <? "diem_yeu_ngu_phap"."chu_de_ngu_phap_id"

Ref "fk_lop_hoc_giang_vien_id":"nguoi_dung"."id" <? "lop_hoc"."giang_vien_id"

Ref "fk_thanh_vien_lop_lop_hoc_id":"lop_hoc"."id" <? "thanh_vien_lop"."lop_hoc_id"

Ref "fk_thanh_vien_lop_nguoi_dung_id":"nguoi_dung"."id" <? "thanh_vien_lop"."nguoi_dung_id"

Ref "fk_bai_nop_viet_nguoi_dung_id":"nguoi_dung"."id" <? "bai_nop_viet"."nguoi_dung_id"

Ref "fk_bai_nop_viet_lop_hoc_id":"lop_hoc"."id" ?<? "bai_nop_viet"."lop_hoc_id"

Ref "fk_bai_nop_viet_giang_vien_id":"nguoi_dung"."id" ?<? "bai_nop_viet"."giang_vien_id"

Ref "fk_thong_ke_nguoi_dung_id":"nguoi_dung"."id" - "thong_ke_nguoi_dung"."nguoi_dung_id"

Ref "fk_goi_dang_ky_nguoi_dung_id":"nguoi_dung"."id" <? "goi_dang_ky"."nguoi_dung_id"

Ref "fk_goi_dang_ky_goi_dich_vu_id":"goi_dich_vu"."id" <? "goi_dang_ky"."goi_dich_vu_id"

Ref "fk_thanh_toan_nguoi_dung_id":"nguoi_dung"."id" <? "thanh_toan"."nguoi_dung_id"

Ref "fk_thanh_toan_goi_dang_ky_id":"goi_dang_ky"."id" ?<? "thanh_toan"."goi_dang_ky_id"

Ref "fk_phien_hoc_nguoi_dung_id":"nguoi_dung"."id" <? "phien_hoc"."nguoi_dung_id"

Ref "fk_diem_ky_nang_nguoi_dung_id":"nguoi_dung"."id" <? "diem_ky_nang"."nguoi_dung_id"
