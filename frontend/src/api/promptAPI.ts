import api from '@/api/axios';

export async function fetchPrompts(): Promise<any> {
try {
    const response = await api.get('/prompts')
    return response.data}
catch (err) {
    console.error("Error fetching prompts:", err);
}
}

export async function createPrompt(formData: FormData): Promise<any> {
try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const prompt = formData.get('prompt') as string
    const response = await api.post('/prompts',{
        "title": title,
        "description": description,
        "prompt": prompt
      })
    return response.data}
catch (err) {
    console.error("Error creating prompt:", err);
}}

export async function updatePrompt(id: number, formData: FormData): Promise<any> {
try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const prompt = formData.get('prompt') as string
    const response = await api.put(`/prompts/${id}`, {
        "title": title,
        "description": description,
        "prompt": prompt
      })
    return response.data}
catch (err) {
    console.error("Error updating prompt:", err);
}}

export async function deletePrompt(id: number): Promise<void> {
try {
    await api.delete(`/prompts/${id}`)}
catch (err) {
    console.error("Error deleting prompt:", err);
}}