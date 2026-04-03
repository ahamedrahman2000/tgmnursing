const supabase = require("../config/supabase");

// ➕ ADD STUDENT
// exports.addStudent = async (req, res) => {
//   try {
//     const form = req.body;

//     const { error } = await supabase.from("students").insert([
//       {
//         admission_no: form.admission_no,
//         admission_date: form.admission_date,
//         registration_date: form.registration_date,
//         student_name: form.student_name,
//         father_name: form.father_name,
//         mother_name: form.mother_name,
//         dob: form.dob,
//         gender: form.gender,
//         mobile: form.mobile,
//         address: form.address,
//         course: form.course,
//         qualification: form.qualification,
//         school_last_attended: form.last_school,
//         parent_occupation: form.parent_occupation,
//         religion: form.religion,
//         aadhar_no: form.aadhar_no,
//         bank_account_no: form.bank_account_no,
//         annual_income: form.income,
//         caste: form.caste,
//         community: form.community,

//         // ✅ FIXED: store array safely
//         documents: form.documents || [],

//         place: form.place,
//       },
//     ]);

//     if (error) {
//       console.log("DB ERROR:", error);
//       return res.status(500).json({ message: "Database Error", error });
//     }

//     res.json({ message: "Student added successfully ✅" });

//   } catch (err) {
//     console.log("SERVER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
exports.addStudent = async (req, res) => {
  try {
    const form = req.body;

    // ✅ CONVERT TO NUMBER
    const total = parseFloat(form.total_fee) || 0;
    const paid = parseFloat(form.paid_fee) || 0;
    const pending = total - paid;

    const { error } = await supabase.from("students").insert([
      {
        admission_no: form.admission_no,
        admission_date: form.admission_date,
        registration_date: form.registration_date,
        student_name: form.student_name,
        father_name: form.father_name,
        mother_name: form.mother_name,
        dob: form.dob,
        gender: form.gender,
        mobile: form.mobile,
        address: form.address,
        course: form.course,
        qualification: form.qualification,
        school_last_attended: form.last_school,
        parent_occupation: form.parent_occupation,
        religion: form.religion,
        aadhar_no: form.aadhar_no,
        bank_account_no: form.bank_account_no,
        annual_income: form.income,
        caste: form.caste,
        community: form.community,
        documents: form.documents || [],
        place: form.place,

        // ✅ FIXED FEES
        total_fee: total,
        paid_fee: paid,
        pending_fee: pending,
      },
    ]);

    if (error) {
      return res.status(500).json({ message: "Database Error", error });
    }

    res.json({ message: "Student added successfully ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 📥 GET STUDENTS
exports.getStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("FETCH ERROR:", error);
      return res.status(500).json({ message: "Fetch Error", error });
    }

    res.json(data);

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ message: "Deleted successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};