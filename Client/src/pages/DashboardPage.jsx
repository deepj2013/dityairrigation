import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const farmerFields = [
  { key: "क्रमांक", label: "क्रमांक" },
  { key: "पंजीयन_क्रमांक", label: "पंजीयन क्रमांक" },
  { key: "नाम", label: "नाम" },
  { key: "पिता_का_नाम", label: "पिता का नाम" },
  { key: "जाति", label: "जाति" },
  { key: "ग्राम", label: "ग्राम" },
  { key: "ग्राम_पंचायत", label: "ग्राम पंचायत" },
  { key: "कुल_रकबा", label: "कुल रकबा" },
  { key: "लाभ_रकबा", label: "लाभ रकबा" },
  { key: "स्पेसिंग", label: "स्पेसिंग" },
  { key: "मोबाइल_नंबर", label: "मोबाइल नंबर" },
  { key: "श्रोत", label: "श्रोत" },
  { key: "खसरा_क्रमांक", label: "खसरा क्रमांक" },
  { key: "लागत", label: "लागत" },
  { key: "अनुदान", label: "अनुदान" },
  { key: "कृषक_अंश", label: "कृषक अंश" },
  { key: "आशय_पत्र", label: "आशय पत्र" },
  { key: "आशय_दिनांक", label: "आशय दिनांक" },
  { key: "विकास_खंड", label: "विकास खंड" },
  { key: "कंपनी", label: "कंपनी" },
  { key: "कृषक_अंश_जमा", label: "कृषक अंश जमा" },
  { key: "UTR_No", label: "UTR No." },
  { key: "Date", label: "Date" },
  { key: "AGENT", label: "AGENT" },
  { key: "SUBMIT_DATE", label: "SUBMIT DATE" },
  { key: "swikrati_kramank", label: "swikrati kramank" },
  { key: "payment_date", label: "payment date" },
  { key: "saman", label: "saman" }
];

const permissionKeys = [
  { key: "canManageUsers", label: "यूज़र प्रबंधन" },
  { key: "canManageFarmers", label: "किसान प्रबंधन" },
  { key: "canManageGallery", label: "गैलरी प्रबंधन" },
  { key: "canManageNotices", label: "सूचना प्रबंधन" },
  { key: "canExportData", label: "डेटा एक्सपोर्ट" },
  { key: "canManageWebsite", label: "वेबसाइट प्रबंधन" },
  { key: "canManageFiles", label: "फ़ाइल प्रबंधन" }
];

const emptyPermissions = Object.fromEntries(permissionKeys.map((item) => [item.key, false]));
const emptyFarmerForm = Object.fromEntries(farmerFields.map((field) => [field.key, ""]));

const romanToHindi = (value) => {
  if (!value) return "";
  const text = value.toLowerCase();

  const consonants = {
    ksh: "क्ष", gny: "ज्ञ", chh: "छ", kh: "ख", gh: "घ", ch: "च", jh: "झ", th: "थ", dh: "ध",
    ph: "फ", bh: "भ", sh: "श", tr: "त्र", gy: "ज्ञ", k: "क", g: "ग", c: "क", j: "ज", t: "त",
    d: "द", n: "न", p: "प", b: "ब", m: "म", y: "य", r: "र", l: "ल", v: "व", w: "व", s: "स", h: "ह", f: "फ", z: "ज", q: "क", x: "क्स"
  };

  const vowelIndependent = {
    aa: "आ", ai: "ऐ", au: "औ", ee: "ई", ii: "ई", oo: "ऊ", uu: "ऊ",
    a: "अ", i: "इ", e: "ए", u: "उ", o: "ओ"
  };

  const vowelMatra = {
    aa: "ा", ai: "ै", au: "ौ", ee: "ी", ii: "ी", oo: "ू", uu: "ू",
    a: "", i: "ि", e: "े", u: "ु", o: "ो"
  };

  const pickToken = (source, index, table) => {
    const keys = Object.keys(table).sort((a, b) => b.length - a.length);
    return keys.find((key) => source.startsWith(key, index)) || "";
  };

  let i = 0;
  let out = "";
  while (i < text.length) {
    const char = text[i];
    if (char === " ") {
      out += " ";
      i += 1;
      continue;
    }

    const cToken = pickToken(text, i, consonants);
    if (cToken) {
      const consonant = consonants[cToken];
      i += cToken.length;
      const vToken = pickToken(text, i, vowelMatra);
      if (vToken) {
        out += consonant + vowelMatra[vToken];
        i += vToken.length;
      } else {
        out += consonant;
      }
      continue;
    }

    const vToken = pickToken(text, i, vowelIndependent);
    if (vToken) {
      out += vowelIndependent[vToken];
      i += vToken.length;
      continue;
    }

    out += value[i];
    i += 1;
  }

  return out;
};

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [menu, setMenu] = useState("farmer");
  const [formData, setFormData] = useState(emptyFarmerForm);
  const [forms, setForms] = useState([]);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [showFarmerViewModal, setShowFarmerViewModal] = useState(false);
  const [showFarmerEditModal, setShowFarmerEditModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [editFarmerData, setEditFarmerData] = useState(emptyFarmerForm);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [dealerForms, setDealerForms] = useState([]);
  const [showDealerModal, setShowDealerModal] = useState(false);
  const [showDealerViewModal, setShowDealerViewModal] = useState(false);
  const [showDealerEditModal, setShowDealerEditModal] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerFormData, setDealerFormData] = useState(emptyFarmerForm);
  const [editDealerData, setEditDealerData] = useState(emptyFarmerForm);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [downloadingUpdatedFile, setDownloadingUpdatedFile] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "ADMIN",
    isActive: true,
    permissions: { ...emptyPermissions, canManageFarmers: true }
  });
  const [editUser, setEditUser] = useState({
    name: "",
    mobile: "",
    role: "ADMIN",
    isActive: true,
    permissions: { ...emptyPermissions }
  });
  const [newPassword, setNewPassword] = useState("");

  const menuItems = useMemo(
    () => [
      { key: "users", label: "यूज़र प्रबंधन", show: user?.role === "UNIVERSAL_ADMIN" },
      { key: "farmer", label: "किसान पंजीयन", show: true },
      { key: "vendor", label: "कंपनी विक्रेता सूची", show: true },
      { key: "dealer", label: "डीलर फॉर्म और सूची", show: true },
      { key: "file", label: "फ़ाइल", show: user?.role === "UNIVERSAL_ADMIN" || user?.permissions?.canManageFiles }
    ].filter((item) => item.show),
    [user]
  );

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const saveFarmer = async (event) => {
    event.preventDefault();
    await api.post("/forms", { ...formData, formType: "FARMER" });
    setFormData(emptyFarmerForm);
    setShowFarmerModal(false);
    setStatusMessage("किसान पंजीयन सफलतापूर्वक सेव हुआ।");
    fetchFarmerForms();
  };

  const fetchFarmerForms = async () => {
    const { data } = await api.get("/forms?formType=FARMER");
    setForms(data);
  };

  const fetchDealerForms = async () => {
    const { data } = await api.get("/forms?formType=DEALER");
    setDealerForms(data);
  };

  const openFarmerView = (item) => {
    setSelectedFarmer(item);
    setShowFarmerViewModal(true);
  };

  const openFarmerEdit = (item) => {
    setSelectedFarmer(item);
    setEditFarmerData(
      farmerFields.reduce((acc, field) => {
        acc[field.key] = item[field.key] || "";
        return acc;
      }, {})
    );
    setShowFarmerEditModal(true);
  };

  const saveFarmerEdit = async (event) => {
    event.preventDefault();
    if (!selectedFarmer?._id) return;
    await api.patch(`/forms/${selectedFarmer._id}`, {
      ...editFarmerData,
      formType: "FARMER"
    });
    setShowFarmerEditModal(false);
    setStatusMessage("फॉर्म अपडेट कर दिया गया है।");
    fetchFarmerForms();
  };

  const toggleFarmerActive = async (item) => {
    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await api.patch(`/forms/${item._id}`, { status: nextStatus });
    setStatusMessage(`फॉर्म की स्थिति ${nextStatus} कर दी गई है।`);
    fetchFarmerForms();
  };

  const saveDealer = async (event) => {
    event.preventDefault();
    await api.post("/forms", { ...dealerFormData, formType: "DEALER" });
    setDealerFormData(emptyFarmerForm);
    setShowDealerModal(false);
    setStatusMessage("डीलर फॉर्म सफलतापूर्वक सेव हुआ।");
    fetchDealerForms();
  };

  const openDealerView = (item) => {
    setSelectedDealer(item);
    setShowDealerViewModal(true);
  };

  const openDealerEdit = (item) => {
    setSelectedDealer(item);
    setEditDealerData(
      farmerFields.reduce((acc, field) => {
        acc[field.key] = item[field.key] || "";
        return acc;
      }, {})
    );
    setShowDealerEditModal(true);
  };

  const saveDealerEdit = async (event) => {
    event.preventDefault();
    if (!selectedDealer?._id) return;
    await api.patch(`/forms/${selectedDealer._id}`, {
      ...editDealerData,
      formType: "DEALER"
    });
    setShowDealerEditModal(false);
    setStatusMessage("डीलर फॉर्म अपडेट कर दिया गया है।");
    fetchDealerForms();
  };

  const toggleDealerActive = async (item) => {
    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await api.patch(`/forms/${item._id}`, { status: nextStatus });
    setStatusMessage(`डीलर फॉर्म की स्थिति ${nextStatus} कर दी गई है।`);
    fetchDealerForms();
  };

  const downloadFarmerExcel = async () => {
    setDownloadingExcel(true);
    try {
      const response = await api.get("/forms/export", { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `kisan-forms-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role !== "UNIVERSAL_ADMIN") return;
    setLoadingUsers(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (menu === "users") fetchUsers();
    if (menu === "farmer") fetchFarmerForms();
    if (menu === "dealer") fetchDealerForms();
    if (menu === "file") fetchFiles();
  }, [menu]);

  const fetchFiles = async () => {
    const { data } = await api.get("/files");
    setFiles(data);
  };

  const uploadExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const payload = new FormData();
    payload.append("file", file);
    payload.append("fileName", file.name);
    setUploadingFile(true);
    try {
      await api.post("/files/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatusMessage("फ़ाइल अपलोड हो गई।");
      fetchFiles();
    } finally {
      setUploadingFile(false);
      event.target.value = "";
    }
  };

  const openFile = async (id) => {
    const { data } = await api.get(`/files/${id}`);
    setSelectedFile(data);
  };

  const updateFileCell = async (rowIndex, column, value) => {
    if (!selectedFile?._id) return;
    await api.patch(`/files/${selectedFile._id}/cell`, { rowIndex, column, value });
  };

  const addFileRow = async () => {
    if (!selectedFile?._id) return;
    const { data } = await api.post(`/files/${selectedFile._id}/row`);
    setSelectedFile(data);
  };

  const addFileColumn = async () => {
    if (!selectedFile?._id || !newColumnName.trim()) return;
    const { data } = await api.post(`/files/${selectedFile._id}/column`, {
      columnName: newColumnName.trim()
    });
    setSelectedFile(data);
    setNewColumnName("");
    setStatusMessage("नया कॉलम सफलतापूर्वक जोड़ दिया गया है।");
  };

  const downloadUpdatedFile = async () => {
    if (!selectedFile?._id) return;
    setDownloadingUpdatedFile(true);
    try {
      const response = await api.get(`/files/${selectedFile._id}/download`, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${selectedFile.fileName || "updated-file"}-updated.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingUpdatedFile(false);
    }
  };

  const togglePermission = (setter, permissionKey) => {
    setter((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: !prev.permissions?.[permissionKey]
      }
    }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    await api.post("/users", newUser);
    setStatusMessage("यूज़र सफलतापूर्वक बना दिया गया है।");
    setNewUser({
      name: "",
      mobile: "",
      password: "",
      role: "ADMIN",
      isActive: true,
      permissions: { ...emptyPermissions, canManageFarmers: true }
    });
    fetchUsers();
  };

  const startEdit = (selectedUser) => {
    setEditUserId(selectedUser._id);
    setEditUser({
      name: selectedUser.name || "",
      mobile: selectedUser.mobile || "",
      role: selectedUser.role || "ADMIN",
      isActive: Boolean(selectedUser.isActive),
      permissions: { ...emptyPermissions, ...(selectedUser.permissions || {}) }
    });
    setNewPassword("");
  };

  const updateUser = async (event) => {
    event.preventDefault();
    if (!editUserId) return;
    await api.patch(`/users/${editUserId}`, editUser);
    if (newPassword.trim()) {
      await api.patch(`/users/${editUserId}/password`, { newPassword });
      setNewPassword("");
    }
    setStatusMessage("यूज़र विवरण अपडेट कर दिया गया है।");
    setEditUserId("");
    fetchUsers();
  };

  const removeUser = async (id) => {
    await api.delete(`/users/${id}`);
    setStatusMessage("यूज़र delete कर दिया गया है।");
    fetchUsers();
  };

  const toggleUserActive = async (item) => {
    await api.patch(`/users/${item._id}`, {
      name: item.name,
      mobile: item.mobile,
      role: item.role,
      permissions: item.permissions || {},
      isActive: !item.isActive
    });
    setStatusMessage(`यूज़र को ${item.isActive ? "Inactive" : "Active"} कर दिया गया है।`);
    fetchUsers();
  };

  const changeUserPassword = async (item) => {
    const entered = window.prompt(`${item.name} का नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर):`);
    if (!entered) return;
    if (entered.trim().length < 6) {
      setStatusMessage("पासवर्ड कम से कम 6 अक्षर का होना चाहिए।");
      return;
    }
    await api.patch(`/users/${item._id}/password`, { newPassword: entered.trim() });
    setStatusMessage("पासवर्ड सफलतापूर्वक अपडेट हो गया है।");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-black text-slate-800">DITYA IRRIGATION डैशबोर्ड</h1>
            <p className="text-xs text-slate-500">यूज़र, फॉर्म और अनुमतियों का प्रबंधन</p>
          </div>
          <button onClick={logout} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">लॉगआउट</button>
        </div>
      </header>
      <div className="mx-auto grid w-[98vw] max-w-[1800px] gap-3 p-3 md:grid-cols-[250px_1fr] md:gap-4 md:p-4">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">मुख्य मेनू</p>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setMenu(item.key)}
              className={`mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${menu === item.key ? "bg-emerald-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {menu === "users" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-800">यूज़र प्रबंधन</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">CRUD + Permission</span>
              </div>
              {statusMessage && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{statusMessage}</p>}

              <form onSubmit={createUser} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                <h3 className="md:col-span-3 text-base font-semibold text-slate-800">नया यूज़र जोड़ें</h3>
                <input required placeholder="नाम" className="rounded-lg border border-slate-300 p-2.5 text-sm" value={newUser.name} onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} />
                <input required placeholder="मोबाइल नंबर" className="rounded-lg border border-slate-300 p-2.5 text-sm" value={newUser.mobile} onChange={(e) => setNewUser((prev) => ({ ...prev, mobile: e.target.value }))} />
                <input required placeholder="पासवर्ड" type="password" className="rounded-lg border border-slate-300 p-2.5 text-sm" value={newUser.password} onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} />
                <select className="rounded-lg border border-slate-300 p-2.5 text-sm" value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="FARMER">FARMER</option>
                </select>
                <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2.5 text-sm">
                  <input type="checkbox" checked={newUser.isActive} onChange={(e) => setNewUser((prev) => ({ ...prev, isActive: e.target.checked }))} />
                  सक्रिय (Active)
                </label>
                <div className="md:col-span-3 grid gap-2 md:grid-cols-3">
                  {permissionKeys.map((item) => (
                    <label key={item.key} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(newUser.permissions[item.key])}
                        onChange={() => togglePermission(setNewUser, item.key)}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <button className="rounded-lg bg-emerald-600 p-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 md:col-span-3">यूज़र बनाएँ</button>
              </form>

              {editUserId && (
                <form onSubmit={updateUser} className="grid gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 md:grid-cols-3">
                  <h3 className="md:col-span-3 text-base font-semibold text-slate-800">यूज़र अपडेट करें</h3>
                  <input required placeholder="नाम" className="rounded-lg border border-slate-300 p-2.5 text-sm" value={editUser.name} onChange={(e) => setEditUser((prev) => ({ ...prev, name: e.target.value }))} />
                  <input required placeholder="मोबाइल नंबर" className="rounded-lg border border-slate-300 p-2.5 text-sm" value={editUser.mobile} onChange={(e) => setEditUser((prev) => ({ ...prev, mobile: e.target.value }))} />
                  <select className="rounded-lg border border-slate-300 p-2.5 text-sm" value={editUser.role} onChange={(e) => setEditUser((prev) => ({ ...prev, role: e.target.value }))}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="FARMER">FARMER</option>
                    <option value="UNIVERSAL_ADMIN">UNIVERSAL_ADMIN</option>
                  </select>
                  <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2.5 text-sm">
                    <input type="checkbox" checked={Boolean(editUser.isActive)} onChange={(e) => setEditUser((prev) => ({ ...prev, isActive: e.target.checked }))} />
                    सक्रिय (Active)
                  </label>
                  <input placeholder="नया पासवर्ड (optional)" type="password" className="rounded-lg border border-slate-300 p-2.5 text-sm md:col-span-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <div className="md:col-span-3 grid gap-2 md:grid-cols-3">
                    {permissionKeys.map((item) => (
                      <label key={item.key} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(editUser.permissions[item.key])}
                          onChange={() => togglePermission(setEditUser, item.key)}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                  <div className="md:col-span-3 flex gap-2">
                    <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">अपडेट सेव करें</button>
                    <button type="button" onClick={() => setEditUserId("")} className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white">रद्द करें</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="border p-2 text-left">नाम</th>
                      <th className="border p-2 text-left">मोबाइल</th>
                      <th className="border p-2 text-left">रोल</th>
                      <th className="border p-2 text-left">स्थिति</th>
                      <th className="border p-2 text-left">Permissions</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td className="p-3" colSpan={6}>लोड हो रहा है...</td></tr>
                    ) : (
                      users.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50">
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">{item.mobile}</td>
                          <td className="border p-2">{item.role}</td>
                          <td className="border p-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="border p-2">{permissionKeys.filter((perm) => item.permissions?.[perm.key]).map((perm) => perm.label).join(", ") || "-"}</td>
                          <td className="border p-2">
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => startEdit(item)} className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">Edit</button>
                              <button
                                type="button"
                                onClick={() => toggleUserActive(item)}
                                className={`rounded px-2 py-1 text-xs font-semibold text-white ${item.isActive ? "bg-amber-600" : "bg-emerald-600"}`}
                              >
                                {item.isActive ? "Inactive करें" : "Active करें"}
                              </button>
                              <button
                                type="button"
                                onClick={() => changeUserPassword(item)}
                                className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white"
                              >
                                पासवर्ड बदलें
                              </button>
                              {item._id !== user.id && (
                                <button type="button" onClick={() => removeUser(item._id)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menu === "farmer" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">किसान पंजीयन</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFarmerModal(true)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    + नया पंजीयन जोड़ें
                  </button>
                  <button
                    type="button"
                    onClick={downloadFarmerExcel}
                    disabled={downloadingExcel}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white disabled:opacity-50"
                    title="एक्सेल डाउनलोड करें"
                    aria-label="एक्सेल डाउनलोड करें"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.29a1 1 0 1 1 1.4 1.41l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.41L11 12.59V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-[980px] w-full text-xs md:text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border p-2 text-left">क्रमांक</th>
                      <th className="border p-2 text-left">पंजीयन क्रमांक</th>
                      <th className="border p-2 text-left">नाम</th>
                      <th className="border p-2 text-left">पिता का नाम</th>
                      <th className="border p-2 text-left">ग्राम</th>
                      <th className="border p-2 text-left">कंपनी</th>
                      <th className="border p-2 text-left">मोबाइल नंबर</th>
                      <th className="border p-2 text-left">स्थिति</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50">
                        <td className="border p-2 whitespace-nowrap">{item.क्रमांक}</td>
                        <td className="border p-2 whitespace-nowrap">{item.पंजीयन_क्रमांक}</td>
                        <td className="border p-2 whitespace-nowrap">{item.नाम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.पिता_का_नाम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.ग्राम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.कंपनी}</td>
                        <td className="border p-2 whitespace-nowrap">{item.मोबाइल_नंबर}</td>
                        <td className="border p-2 whitespace-nowrap">{item.status}</td>
                        <td className="border p-2 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            <button type="button" onClick={() => openFarmerView(item)} className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold text-white">पूरा देखें</button>
                            <button type="button" onClick={() => openFarmerEdit(item)} className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white">Edit</button>
                            <button
                              type="button"
                              onClick={() => toggleFarmerActive(item)}
                              className={`rounded px-2 py-1 text-xs font-semibold text-white ${item.status === "ACTIVE" ? "bg-amber-600" : "bg-emerald-600"}`}
                            >
                              {item.status === "ACTIVE" ? "Inactive करें" : "Active करें"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showFarmerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <form onSubmit={saveFarmer} className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">नया किसान पंजीयन फॉर्म</h3>
                      <button type="button" onClick={() => setShowFarmerModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                          <input
                            required={["क्रमांक", "पंजीयन_क्रमांक", "नाम", "मोबाइल_नंबर"].includes(field.key)}
                            placeholder={`${field.label} (English typing)`}
                            className="w-full rounded border p-2 text-sm"
                            value={formData[field.key]}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const shouldConvert = !["मोबाइल_नंबर", "UTR_No", "Date", "SUBMIT_DATE", "payment_date"].includes(field.key);
                              setFormData((prev) => ({
                                ...prev,
                                [field.key]: shouldConvert ? romanToHindi(raw) : raw
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full rounded bg-emerald-600 p-2.5 font-semibold text-white">फॉर्म सेव करें</button>
                  </form>
                </div>
              )}

              {showFarmerViewModal && selectedFarmer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">पूरा किसान फॉर्म विवरण</h3>
                      <button type="button" onClick={() => setShowFarmerViewModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="rounded border p-2">
                          <p className="text-xs font-semibold text-slate-500">{field.label}</p>
                          <p className="text-sm text-slate-800">{selectedFarmer[field.key] || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showFarmerEditModal && selectedFarmer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <form onSubmit={saveFarmerEdit} className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">किसान फॉर्म एडिट करें</h3>
                      <button type="button" onClick={() => setShowFarmerEditModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                          <input
                            className="w-full rounded border p-2 text-sm"
                            value={editFarmerData[field.key] || ""}
                            onChange={(e) => setEditFarmerData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full rounded bg-indigo-600 p-2.5 font-semibold text-white">अपडेट सेव करें</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {menu === "vendor" && <p className="text-slate-700">विक्रेता/कंपनी रिकॉर्ड प्रबंधन के लिए `VENDOR` और `COMPANY` टाइप का उपयोग करें।</p>}
          {menu === "dealer" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">डीलर फॉर्म और सूची</h2>
                <button
                  type="button"
                  onClick={() => setShowDealerModal(true)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  + नया डीलर फॉर्म
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-[980px] w-full text-xs md:text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border p-2 text-left">क्रमांक</th>
                      <th className="border p-2 text-left">पंजीयन क्रमांक</th>
                      <th className="border p-2 text-left">नाम</th>
                      <th className="border p-2 text-left">पिता का नाम</th>
                      <th className="border p-2 text-left">ग्राम</th>
                      <th className="border p-2 text-left">कंपनी</th>
                      <th className="border p-2 text-left">मोबाइल नंबर</th>
                      <th className="border p-2 text-left">स्थिति</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealerForms.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50">
                        <td className="border p-2 whitespace-nowrap">{item.क्रमांक}</td>
                        <td className="border p-2 whitespace-nowrap">{item.पंजीयन_क्रमांक}</td>
                        <td className="border p-2 whitespace-nowrap">{item.नाम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.पिता_का_नाम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.ग्राम}</td>
                        <td className="border p-2 whitespace-nowrap">{item.कंपनी}</td>
                        <td className="border p-2 whitespace-nowrap">{item.मोबाइल_नंबर}</td>
                        <td className="border p-2 whitespace-nowrap">{item.status}</td>
                        <td className="border p-2 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            <button type="button" onClick={() => openDealerView(item)} className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold text-white">पूरा देखें</button>
                            <button type="button" onClick={() => openDealerEdit(item)} className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white">Edit</button>
                            <button
                              type="button"
                              onClick={() => toggleDealerActive(item)}
                              className={`rounded px-2 py-1 text-xs font-semibold text-white ${item.status === "ACTIVE" ? "bg-amber-600" : "bg-emerald-600"}`}
                            >
                              {item.status === "ACTIVE" ? "Inactive करें" : "Active करें"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showDealerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <form onSubmit={saveDealer} className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">नया डीलर फॉर्म</h3>
                      <button type="button" onClick={() => setShowDealerModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                          <input
                            placeholder={`${field.label} (English typing)`}
                            className="w-full rounded border p-2 text-sm"
                            value={dealerFormData[field.key]}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const shouldConvert = !["मोबाइल_नंबर", "UTR_No", "Date", "SUBMIT_DATE", "payment_date"].includes(field.key);
                              setDealerFormData((prev) => ({
                                ...prev,
                                [field.key]: shouldConvert ? romanToHindi(raw) : raw
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full rounded bg-emerald-600 p-2.5 font-semibold text-white">फॉर्म सेव करें</button>
                  </form>
                </div>
              )}

              {showDealerViewModal && selectedDealer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">पूरा डीलर फॉर्म विवरण</h3>
                      <button type="button" onClick={() => setShowDealerViewModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="rounded border p-2">
                          <p className="text-xs font-semibold text-slate-500">{field.label}</p>
                          <p className="text-sm text-slate-800">{selectedDealer[field.key] || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showDealerEditModal && selectedDealer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <form onSubmit={saveDealerEdit} className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold">डीलर फॉर्म एडिट करें</h3>
                      <button type="button" onClick={() => setShowDealerEditModal(false)} className="rounded bg-slate-200 px-3 py-1 text-sm">बंद करें</button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {farmerFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                          <input
                            className="w-full rounded border p-2 text-sm"
                            value={editDealerData[field.key] || ""}
                            onChange={(e) => setEditDealerData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full rounded bg-indigo-600 p-2.5 font-semibold text-white">अपडेट सेव करें</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {menu === "file" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">फ़ाइल प्रबंधन (Excel)</h2>
                <label className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  {uploadingFile ? "अपलोड हो रहा..." : "Excel अपलोड करें"}
                  <input type="file" accept=".xlsx,.xls" className="hidden" onChange={uploadExcel} />
                </label>
              </div>

              <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
                <div className="rounded-xl border border-slate-200 p-3">
                  <h3 className="mb-2 font-semibold">अपलोडेड फ़ाइलें</h3>
                  <div className="max-h-[50vh] space-y-2 overflow-auto">
                    {files.map((item) => (
                      <button key={item._id} onClick={() => openFile(item._id)} className="w-full rounded border px-3 py-2 text-left text-sm hover:bg-slate-50">
                        {item.fileName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  {!selectedFile ? (
                    <p className="text-slate-600">फाइल चुनें, फिर cell edit करके डेटा update करें।</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold md:text-base">{selectedFile.fileName}</h3>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={addFileRow} className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">+ Row</button>
                          <button
                            onClick={downloadUpdatedFile}
                            disabled={downloadingUpdatedFile}
                            className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {downloadingUpdatedFile ? "डाउनलोड..." : "अपडेटेड फ़ाइल डाउनलोड"}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <input
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          placeholder="नया कॉलम नाम लिखें (जैसे: टिप्पणी)"
                          className="min-w-[220px] flex-1 rounded border border-slate-300 p-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={addFileColumn}
                          className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
                        >
                          + कॉलम जोड़ें
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        किसी भी cell में बदलाव करें; input छोड़ते ही data save हो जाएगा। फिर "अपडेटेड फ़ाइल डाउनलोड" से updated excel लें।
                      </p>
                      <div className="max-h-[65vh] overflow-auto rounded border">
                        <table className="min-w-[860px] w-full text-xs md:text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="border p-2">#</th>
                              {selectedFile.headers.map((header) => (
                                <th key={header} className="border p-2 text-left">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedFile.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="border p-2">{rowIndex + 1}</td>
                                {selectedFile.headers.map((header) => (
                                  <td key={`${rowIndex}-${header}`} className="border p-1">
                                    <input
                                      className="w-full rounded border p-1"
                                      defaultValue={row?.[header] ?? ""}
                                      onBlur={(e) => updateFileCell(rowIndex, header, e.target.value)}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
