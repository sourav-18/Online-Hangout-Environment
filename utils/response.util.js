exports.success = (message, data) => {
    return {
        status: 'success',
        statusCode: 200,
        message: message,
        data: data ?? null
    };
}

exports.error = (message, data) => {
    return {
        status: 'error',
        statusCode: 500,
        message: message,
        data: data ?? null
    };
}