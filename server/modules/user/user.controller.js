require("dotenv").config();
const passport = require("passport");
const base64url = require("../../helper");
const userEntity = require("../../model/user.model");
const crypto = require("crypto");
const sendEmail = require("../../service/sendEmail");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
    console.log(btoa(password));
    const user = await userEntity.findOne({
      $or: [{ email: input }, { username: input }],
    });
    if (!user || await bcrypt.compare(password, user.password) === false)
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
    const {
      fullname,
      username,
      email,
      password,
      confirmPassword,
      phone,
      gender,
      dateOfBirth,
    } = req.body;
    const avatar = req.file.path;
    // Kiểm tra username đã tồn tại
    const existingUsername = await userEntity.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Tên đăng nhập này đã tồn tại" });
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await userEntity.findOne({
      $and: [{ email }, { loginMethod: "Email thường" }],
    });
    if (existingEmail) {
      return res.status(409).json({ message: "Email này đã được đăng ký" });
    }

    // Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không trùng khớp" });
    }

    // Kiểm tra số điện thoại đã tồn tại
    if (phone) {
      const existingPhone = await userEntity.findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({ message: "Số điện thoại này đã được đăng ký" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    await userEntity.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      avatar,
      loginMethod: "Email thường",
    });

    const code = Math.floor(100000 + Math.random() * 900000);
    newUser.resetCode = code;
    newUser.resetCodeExpiration = Date.now() + 5 * 60 * 1000;
    await newUser.save();
    await sendEmail(newUser.email, code);
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
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRegister:", error);
    return res
      .status(500)
      .json({ message: "Đăng ký thất bại", error: error.message });
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

exports.postReset = async (req, res) => {
  try {
    const user = await userEntity.findOne({ email: req.body.input });
    if (!user) return res.status(404).json({message : "Không tìm thấy tài khoản với email đã nhập"});
    if (user.loginMethod !== "Email thường") return res.status(400).json({message : "Tài khoản không được hỗ trợ reset mật khẩu"});
    const code = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = code;
    user.resetCodeExpiration = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendEmail(user.email, code);
    return res.status(200).json({ message: "Mã xác nhận đã được gửi đến email của bạn" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getReset", error);
    return res.status(500).json({message : error.message});
  }
};

exports.postConfirm = async (req, res) => {
  try {
    const inputCode = Number(req.body.input);
    const user = await userEntity.findOne({ email: req.body.email });
    if (user.resetCode !== inputCode) return res.status(400).json({message : "Mã xác nhận không hợp lệ"});
    if (user.resetCodeExpiration < Date.now()) return res.status(400).json({message : "Mã xác nhận đã hết hạn"});
    if(req.body?.method === "password")user.password = await bcrypt.hash(req.body.password, saltRounds);
    user.resetCode = null;
    user.resetCodeExpiration = null;
    user.isVerified = true;
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postConfirm", error);
    return res.status(500).json({message : error.message});
  }
};