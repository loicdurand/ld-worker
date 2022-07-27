export default (fn) => {

    return (...args) => {
        if (!window.Worker)
            return (...args) => new Promise((res, rej) => {
                requestAnimationFrame(() => {
                    try {
                        res(fn(...args));
                    } catch (err) {
                        rej(err);
                    }
                });
            });

        const //
            listener = (resolve) =>({ data: result }) =>  resolve(result),
            code = (w, fn) => onmessage = ({ data: args }) => w.postMessage(fn(...args)),
            arr = ['(', code.toString(), ')(self,', fn.toString(), ')'],
            blob = new Blob(arr, { type: 'application/javascript' }),
            worker = new Worker(URL.createObjectURL(blob));

        worker.postMessage(args);
        return new Promise((resolve, reject) => {
            worker.addEventListener('message', listener(resolve))
            worker.onerror = e => reject(e);
        });
    }
}

