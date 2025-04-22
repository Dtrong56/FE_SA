class Information {
    constructor(data = {}) {
        this.idInfo = data.idInfo || 0;
        this.cic = data.cic || '';
        this.fullName = this.combineFullName(data.firstName, data.middleName, data.lastName);
        this.firstName = data.firstName || '';
        this.middleName = data.middleName || '';
        this.lastName = data.lastName || '';
        this.dateOfBirth = data.dateOfBirth || null;
        this.sex = data.sex || false;
        this.permanentAddress = data.permanentAddress || '';
        this.phoneNumber = data.phoneNumber || '';
        this.email = data.email || '';
        this.updateAt = data.updateAt || null;
    }

    combineFullName(firstName = '', middleName = '', lastName = '') {
        return [firstName, middleName, lastName].filter(Boolean).join(' ');
    }

    static fromDTO(dto) {
        return new Information(dto);
    }

    toDTO() {
        return {
            idInfo: this.idInfo,
            cic: this.cic,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            sex: this.sex,
            permanentAddress: this.permanentAddress,
            phoneNumber: this.phoneNumber,
            email: this.email,
            updateAt: this.updateAt
        };
    }
}

export default Information;