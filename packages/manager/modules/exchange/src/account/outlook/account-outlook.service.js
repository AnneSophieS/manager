export default class ExchangeAccountOutlook {
  /* @ngInject */
  constructor(Exchange, exchangeAccount, exchangeAccountTypes, exchangeSelectedService, OvhHttp) {
    this.Exchange = Exchange;
    this.exchangeAccount = exchangeAccount;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.exchangeSelectedService = exchangeSelectedService;
    this.OvhHttp = OvhHttp;
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  generateOutlookUrl(organizationName, serviceName, model) {
    return this.OvhHttp.post(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${
        model.primaryEmailAddress
      }/outlookURL`,
      {
        rootPath: 'apiv6',
        data: {
          version: model.licenceVersion,
          language: model.language.toLowerCase(),
        },
      },
    ).then((response) => {
      this.Exchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  getLicenceDetails(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}/outlookURL`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  getLicenceOptions(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.get(
      `/sws/exchange/${organizationName}/${serviceName}/${primaryEmailAddress}/license/options`,
      {
        rootPath: '2api',
      },
    );
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  orderOutlook(organizationName, serviceName, model) {
    return this.OvhHttp.post(
      `/order/email/exchange/${organizationName}/service/${serviceName}/outlook/${
        model.duration
      }`,
      {
        rootPath: 'apiv6',
        data: {
          licence: model.licenceVersion,
          primaryEmailAddress: model.primaryEmailAddress,
        },
      },
    ).then((response) => {
      this.Exchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {object} model
   */
  activateOutlook(organizationName, serviceName, model) {
    const data = {
      outlookLicense: true,
      primaryEmailAddress: model.primaryEmailAddress,
    };

    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${
        model.primaryEmailAddress
      }`,
      {
        rootPath: 'apiv6',
        data,
      },
    ).then((response) => {
      this.Exchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  delete(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data: {
          deleteOutlookAtExpiration: true,
        },
      },
    ).then((response) => {
      this.Exchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * @param {string} organizationName
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  deactivate(organizationName, serviceName, primaryEmailAddress) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${serviceName}/account/${primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data: {
          outlookLicense: false,
        },
      },
    ).then((response) => {
      this.Exchange.refreshViews('Accounts', 'Tasks');

      return response;
    });
  }

  /**
   * Accounts can have Outlook license if is not a placeholder account
   * and if its type allows having an Outlook license
   * @param {object} account
   * @returns {boolean} True if the `account` can have an Outlook license
   */
  canHaveLicense(account) {
    return (
      !this.exchangeAccountTypes.is(account, this.exchangeAccountTypes.TYPES.BASIC)
      && !this.exchangeAccount.isPlaceholder(account)
    );
  }

  /**
   * @param {object} account
   * @param {string} status
   * @returns {boolean} True if the `account` status matches the input `status`
   */
  hasStatus(account, status) {
    return this.getStatus(account) === status;
  }
}
