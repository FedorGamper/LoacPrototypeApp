export function resolveAfter(miliseconds) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, miliseconds);
    });
}