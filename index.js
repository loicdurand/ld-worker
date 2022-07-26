
export default (fn) => {

    if (!window.Worker)
        return (...args) => new Promise((res, rej) => {
            try {
                res(fn(...args));
            } catch (err) {
                rej(err);
            }
        });

    const //
        code = (w, fn) => onmessage = ({ data: args }) => w.postMessage(fn(...args)),
        arr = ['(', code.toString(), ')(self,', fn.toString(), ')'],
        blob = new Blob(arr, { type: 'application/javascript' }),
        worker = new Worker(URL.createObjectURL(blob));

    return (...args) => new Promise((resolve, reject) => {
        worker.postMessage(args);
        worker.onmessage = ({ data: result }) => resolve(result);
        worker.onerror = e => reject(e);
    });


}

