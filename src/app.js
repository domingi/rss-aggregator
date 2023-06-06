import './styles.scss';
import '../index.html';

import { object, string } from 'yup';

console.log('2');

export default () => {
    let userSchema = object({
        url: string().url().nullable()
    });
    
    const state = {};
    
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        console.log(url);
        const valid = await userSchema.validate({ url });
        console.log(valid)
    });

    console.log('2');

};