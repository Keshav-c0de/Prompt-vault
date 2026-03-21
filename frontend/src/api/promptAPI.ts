import api from '@/api/axios';

export async function fetchPrompts(): Promise<any> {
try {
    const response = await api.get('/prompts')
    return response.data}
catch (err) {
    console.error("Error fetching prompts:", err);
}
}

export async function createPrompt(promptData: any): Promise<any> {
try {
    const response = await api.post('/create', promptData);
    return response.data}
catch (err) {
    console.error("Error creating prompt:", err);
}}

export async function updatePrompt(id: number, promptupdate: any): Promise<any> {
try {
    const response = await api.patch(`/update/${id}`, promptupdate);
    return response.data}
catch (err) {
    console.error("Error updating prompt:", err);
}}

export async function deletePrompt(id: number): Promise<void> {
try {
    await api.delete(`/delete/${id}`)}
catch (err) {
    console.error("Error deleting prompt:", err);
}}