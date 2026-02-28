import { useState } from 'react'
import { Plus, Trash2, ExternalLink, BookOpen, Link as LinkIcon } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

function AddArticleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addArticle = useStore((s) => s.addArticle)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    addArticle({
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      title: title.trim() || url.trim(),
      notes: notes.trim(),
    })
    setUrl(''); setTitle(''); setNotes('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Link</DialogTitle>
          <DialogDescription>Save a recipe link or meal idea</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="art-url">URL *</Label>
            <div className="relative mt-1">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="art-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…" className="pl-10" required />
            </div>
          </div>
          <div>
            <Label htmlFor="art-title">Title</Label>
            <Input id="art-title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a name…" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="art-notes">Notes</Label>
            <Textarea id="art-notes" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Why did you save this?" className="mt-1 min-h-[80px]" />
          </div>
          <Button type="submit" className="w-full">Save Link</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Articles() {
  const articles = useStore((s) => s.articles)
  const deleteArticle = useStore((s) => s.deleteArticle)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="pt-safe-header bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pb-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-[#7ececa] uppercase tracking-widest mb-1">Inspiration</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Saved</h1>
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
            {articles.length} links
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide px-4 py-4 space-y-3">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#e8f8f7] dark:bg-[#1a3a38] flex items-center justify-center mb-4">
              <BookOpen className="h-9 w-9 text-[#7ececa]" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">No saved links yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Save recipe ideas and articles here</p>
          </div>
        ) : (
          articles.map((article) => {
            const domain = (() => {
              try { return new URL(article.url).hostname.replace('www.', '') }
              catch { return article.url }
            })()
            return (
              <div key={article.id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft p-4 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#e8f8f7] dark:bg-[#1a3a38] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                      alt="" className="h-6 w-6"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{article.title}</p>
                    <p className="text-xs text-[#7ececa] mt-0.5 truncate">{domain}</p>
                    {article.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{article.notes}</p>
                    )}
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                      {new Date(article.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#e8f8f7] dark:bg-[#1a3a38] text-[#7ececa] hover:bg-[#ccf0ee] dark:hover:bg-[#1f4542] transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button onClick={() => deleteArticle(article.id)}
                      className="p-2 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-5 z-30 h-14 w-14 rounded-full bg-[#7ececa] text-white shadow-fab flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <AddArticleDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
