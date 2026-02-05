const passport = require("passport");
const base64url = require("../../helper");
const userEntity = require("../../model/user.model");
const crypto = require("crypto");
const jwtSecret =
  "shYnTMnSsbRecWsZx/pcjWMtlAx1RkZD3muD1n68BT71prXoWPblE85ass7GTIpNTkDNPz3osyT9NN9gOSyQl5W+Tj24JeLJD9ox60JDivz4UjSuciDhOS7ffeSzl2Gs8oq8UtrvSB7nfApSGExk1LsqkwCubjH51Dl0BtVZitk4zbdXevD6nq7JPppJY4PEWZAnyOwQT5tAVlBWptGGmGBadkQZ7AsU9wvo80kGYdTmA6aK3nOU2jaM+cS/pKGwJDA9ZWFE6fUk3oaLFF6jui/+0o7iVzK7ehN4d+UTE4u05XdCaulQZt9MsZjbeipnF+qeFdQh6EB5Wgbx+PN1fA==";

//Hàm chuyển hướng đến trang đăng nhập google
exports.getLoginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"], //Lấy giá trị profile và email
  prompt: "select_account", //Mỗi lần chuyển đến trang đăng nhập google, người dùng có thể chọn tài khoản khác
});
//Hàm xử lý kết quả đăng nhập google
exports.getResultLoginGoogle = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Token hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64url(JSON.stringify(payload));
    //Tạo Token data với header và payload đã mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    res.redirect(`http://localhost:5173?token=${tokenData + "." + signature}`); //Đăng nhập google thành công thì tạo jwt token và chuyển hướng về trang chủ đính kèm token vừa tạo
  },
];
exports.postLogin = async (req, res) => {
  try {
    const { input, password } = req.body;
    const user = await userEntity.findOne({
      $or: [{ email: input }, { username: input }],
    });
    if (!user || password !== user.password)
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Token hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64url(JSON.stringify(payload));
    //Tạo Token data với header và payload đã mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: tokenData + "." + signature,
      data: user,
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postLogin");
    return res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
exports.postRegister = async (req, res) => {
  try {
    const { fullname, username, email, password, confirmPassword, phone, gender, dateOfBirth } = req.body;

    // Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không trùng khớp" });
    }

    // Kiểm tra username đã tồn tại
    const existingUsername = await userEntity.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await userEntity.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    // Kiểm tra số điện thoại đã tồn tại
    if (phone) {
      const existingPhone = await userEntity.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ message: "Số điện thoại đã được đăng ký" });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = await userEntity.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      loginMethod: "Email thường",
      status: "active",
    });

    // Tạo JWT token
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: newUser._id,
      exp: Date.now() + 3600000, //Token hạn 1 tiếng
    };
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    const token = tokenData + "." + signature;

    return res.status(201).json({
      message: "Đăng ký thành công",
      token,
      data: newUser,
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRegister:", error);
    return res.status(500).json({ message: "Đăng ký thất bại", error: error.message });
  }
};
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    //Tạo lại signature và so sánh với signature cũ
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    if (signature === tokenSignature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json("Token đã hết hạn");
      const user = await userEntity.findOne({ _id: payload.sub });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getMe");
    return res
      .status(500)
      .json({ message: "Lấy thông tin người dùng thất bại" });
  }
};
