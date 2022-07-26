
export default (fn) => {

    if (window.Worker) {

        const //
            code = (worker, fn) => {
                onmessage = function (e) {
                    const // 
                        { data } = e,
                        args = data,
                        result = fn(...args);
                    worker.postMessage(result);
                }
            },
            str = ` (${code.toString()})(self, ${fn.toString()})`,
            blob = new Blob([str], { type: 'application/javascript' }),
            worker = new Worker(URL.createObjectURL(blob));

        return (...args) => new Promise((resolve, reject) => {
            worker.postMessage(args);
            worker.onmessage = ({ data: result }) => resolve(result);
            worker.onerror = e => reject(e);
        });

    } else {
        return (...args) => new Promise((resolve, reject) => {
            try {
                const result = fn(...args);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

}

