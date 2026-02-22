import { useState } from 'react'
import { Plus, Trash2, ExternalLink, BookOpen, Link as LinkIcon, Bookmark } from 'lucide-react'
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
    setUrl('')
    setTitle('')
    setNotes('')
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
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="art-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="art-title">Title</Label>
            <Input
              id="art-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a name…"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="art-notes">Notes</Label>
            <Textarea
              id="art-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why did you save this?"
              className="mt-1 min-h-[80px]"
            />
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
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="pt-safe relative overflow-hidden bg-gradient-to-br from-[#0f766e]/10 via-surface to-surface border-b border-border/60 px-4 pt-5 pb-4">
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-[#0f766e]/8 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0f766e] mb-0.5">Recipes</p>
            <h1 className="text-3xl font-extrabold text-foreground leading-none">Saved</h1>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-[#0f766e]/15 text-[#0f766e] text-[10px] font-bold">
                <Bookmark className="h-3 w-3" />
                {articles.length} link{articles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide px-4 py-4 space-y-3">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-3xl bg-teal-subtle flex items-center justify-center mb-4 animate-float">
              <BookOpen className="h-9 w-9 text-[#0f766e]" />
            </div>
            <p className="font-semibold text-foreground">No saved links yet</p>
            <p className="text-sm text-muted-foreground mt-1">Save recipe ideas and articles here</p>
          </div>
        ) : (
          articles.map((article) => {
            const domain = (() => {
              try {
                return new URL(article.url).hostname.replace('www.', '')
              } catch {
                return article.url
              }
            })()

            return (
              <div
                key={article.id}
                className="bg-surface rounded-3xl border border-border/40 shadow-soft p-4 animate-fade-in transition-shadow duration-200 hover:shadow-card"
              >
                <div className="flex items-start gap-3">
                  {/* Favicon */}
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-subtle flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                      alt=""
                      className="h-6 w-6"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-snug">{article.title}</p>
                    <p className="text-xs text-[#0f766e] mt-0.5 truncate">{domain}</p>
                    {article.notes && (
                      <p className="text-sm text-foreground-3 mt-1.5 leading-relaxed">{article.notes}</p>
                    )}
                    <p className="text-xs text-foreground-5 mt-2">
                      {new Date(article.addedAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-teal-subtle text-[#0f766e] hover:bg-teal-subtle-hover active:scale-90 transition-all duration-150"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-2 rounded-xl text-foreground-5 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all duration-150"
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

      {/* FAB — fixed above bottom nav */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Save link"
        className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full bg-[#0f766e] shadow-fab flex items-center justify-center text-white active:scale-90 transition-all duration-150"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddArticleDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
