const ResponseCode = {
    SUCCESS: 0,
    FILE_NOT_FOUND: 1,
    DATABASE_ERROR: 2,
    VALIDATION_ERROR: 3,
    AUTHORIZATION_ERROR: 4,
    AUTHENTICATION_ERROR: 5,
    MISSING_PARAMETER: 6,
    INTERNAL_SERVER_ERROR: 7,
};

const OrderStateCode = {
    PROCESSED: 1,
    CONFIRMED: 2,
    ON_SHIPPED: 3,
    FINISHED: 4,
    CANCELED: 5,
};

module.exports = {
    ResponseCode,
    OrderStateCode,
};
