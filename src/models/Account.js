class Account {
  constructor(data) {
    this.id = data.idAccount; // Add this line to provide the id field
    this.idAccount = data.idAccount;
    this.accountName = data.accountName;
    this.password = data.password;
    this.isLocked = data.isLocked;
    this.information = data.information;
  }

  static fromDTO(dto) {
    return new Account({
      idAccount: dto.idAccount,
      accountName: dto.accountName,
      password: dto.password,
      isLocked: dto.isLocked,
      information: dto.information
    });
  }

  static getValidationRules() {
    return {
      accountName: {
        required: "Tên tài khoản không được để trống",
        minLength: { value: 5, message: "Tên tài khoản phải từ 5 đến 50 ký tự" },
        maxLength: { value: 50, message: "Tên tài khoản phải từ 5 đến 50 ký tự" }
      },
      password: {
        required: "Mật khẩu không được để trống",
        minLength: { value: 5, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        maxLength: { value: 100, message: "Mật khẩu không được vượt quá 100 ký tự" }
      },
      isLocked: {
        required: "Trạng thái khóa tài khoản là bắt buộc (true/false)"
      }
    };
  }
}

export default Account;