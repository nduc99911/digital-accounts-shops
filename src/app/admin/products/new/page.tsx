import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'

export default function NewProduct() {
  if (!isAuthed()) redirect('/admin/login')

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Thêm sản phẩm</h2>
      <form action="/api/admin/products" method="post" className="grid gap-3">
        <input className="rounded-md border px-3 py-2" name="name" placeholder="Tên sản phẩm" required />
        <input className="rounded-md border px-3 py-2" name="slug" placeholder="Slug (vd: chatgpt-plus)" required />
        <input className="rounded-md border px-3 py-2" name="priceVnd" placeholder="Giá VND (vd: 120000)" required />
        <input className="rounded-md border px-3 py-2" name="duration" placeholder="Thời hạn (vd: 1 tháng)" />
        <select className="rounded-md border px-3 py-2" name="warranty" defaultValue="FULL">
          <option value="FULL">Full BH</option>
          <option value="LIMITED">BH giới hạn</option>
          <option value="NONE">Không BH</option>
        </select>
        <input className="rounded-md border px-3 py-2" name="imageUrl" placeholder="Link ảnh (tạm)" />
        <textarea className="rounded-md border px-3 py-2" name="shortDesc" placeholder="Mô tả ngắn" rows={2} />
        <textarea className="rounded-md border px-3 py-2" name="description" placeholder="Mô tả chi tiết" rows={5} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked />
          Hiển thị sản phẩm
        </label>
        <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Lưu</button>
      </form>
    </div>
  )
}
