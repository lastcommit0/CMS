import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Zap,
    Globe,
    FileText,
    ChevronRight,
    Loader2,
    ExternalLink,
    Send,
    RefreshCw,
    TrendingUp,
    MapPin,
    Tag,
    Clock,
    CheckCircle2,
    AlertCircle,
    Newspaper,
    Bot,
    Search
} from 'lucide-react';
import { useGenerateStoryStream, useTrendingTopics, useNewsAgentHealth } from '@/hooks/useNewsAgent';
import type { TrendingTopic } from '@/services/newsAgentService';

const CATEGORIES = [
    { id: 'General', label: 'General', icon: '📰' },
    { id: 'Politics', label: 'Politics', icon: '🏛️' },
    { id: 'Sports', label: 'Sports', icon: '⚽' },
    { id: 'Business', label: 'Business', icon: '💼' },
    { id: 'Technology', label: 'Technology', icon: '💻' },
    { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'Local', label: 'Local', icon: '📍' },
];

const PROGRESS_STAGES = [
    { key: 'router', label: 'Analyzing Topic', icon: Search },
    { key: 'research', label: 'Researching News', icon: Globe },
    { key: 'orchestrator', label: 'Planning Story', icon: FileText },
    { key: 'worker', label: 'Writing Content', icon: Sparkles },
    { key: 'reducer', label: 'Finalizing', icon: CheckCircle2 },
];

export default function NewsStoryAgent() {
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('General');
    const [mandal, setMandal] = useState('');
    const [district, setDistrict] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);


    const { data: isHealthy, isLoading: isCheckingHealth } = useNewsAgentHealth();
    const { data: trendingTopics, isLoading: isLoadingTrending, refetch: refetchTrending } = useTrendingTopics(category);
    const { generate, reset, isGenerating, progress, result, error } = useGenerateStoryStream();

    const handleGenerate = () => {
        if (!topic.trim()) return;
        generate({
            topic: topic.trim(),
            category,
            mandal,
            district,
            as_of: new Date().toISOString().split('T')[0]
        });
    };

    const handleTopicClick = (selectedTopic: string) => {
        setTopic(selectedTopic);
    };

    const handleSendToEditor = () => {
        if (!result) return;
        setIsTransitioning(true);
        // Store in sessionStorage for AddStory to pick up
        sessionStorage.setItem('newsAgent:generatedStory', JSON.stringify(result));

        // Short delay for the animation to be seen
        setTimeout(() => {
            navigate('/user/stories/add');
        }, 800);
    };

    const getCurrentStage = () => {
        if (!progress?.node) return -1;
        return PROGRESS_STAGES.findIndex(s => s.key === progress.node);
    };

    const currentStage = getCurrentStage();

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
            {/* Transition Overlay */}
            {isTransitioning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1f35]/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl animate-pulse" />
                            <Loader2 className="h-16 w-16 text-blue-400 animate-spin mx-auto relative z-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 animate-bounce">Preparing Editor...</h2>
                        <p className="text-blue-200">Transferring AI agent data to CMS</p>
                    </div>
                </div>
            )}
            {/* Header with glowing effect */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1f35] via-[#243874] to-[#2d4a9e] px-8 py-8">
                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 blur-lg opacity-60" />
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                                <Bot className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                News Story Agent
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-yellow-300 backdrop-blur-sm">
                                    <Zap className="h-3 w-3" /> AI Powered
                                </span>
                            </h1>
                            <p className="text-sm text-blue-200 mt-1">
                                Generate professional news stories from trending topics in seconds
                            </p>
                        </div>
                    </div>

                    {/* Health indicator */}
                    <div className="flex items-center gap-2">
                        {isCheckingHealth ? (
                            <span className="flex items-center gap-2 text-blue-200 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" /> Checking service...
                            </span>
                        ) : isHealthy ? (
                            <span className="flex items-center gap-2 text-emerald-300 text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                Agent Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-red-300 text-sm">
                                <AlertCircle className="h-4 w-4" /> Agent Offline
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Topic Input & Trending */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Topic Input Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                What's the news about?
                            </label>
                            <div className="relative">
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter a news topic, headline, or event..."
                                    rows={3}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none"
                                />
                                <Newspaper className="absolute right-3 top-3 h-5 w-5 text-slate-300" />
                            </div>

                            {/* Category Pills */}
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${category === cat.id
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            <span>{cat.icon}</span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Fields */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Mandal
                                    </label>
                                    <input
                                        type="text"
                                        value={mandal}
                                        onChange={(e) => setMandal(e.target.value)}
                                        placeholder="e.g., Lucknow"
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <Tag className="h-3 w-3" /> District
                                    </label>
                                    <input
                                        type="text"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        placeholder="e.g., Lucknow"
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!topic.trim() || isGenerating || !isHealthy}
                                className="mt-6 w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Generating Story...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            Generate News Story
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                        </div>

                        {/* Trending Topics Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-orange-500" />
                                    Trending in {category}
                                </h3>
                                <button
                                    onClick={() => refetchTrending()}
                                    disabled={isLoadingTrending}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoadingTrending ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {isLoadingTrending ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : trendingTopics && trendingTopics.length > 0 ? (
                                <div className="space-y-3">
                                    {trendingTopics.map((item: TrendingTopic, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => handleTopicClick(item.topic)}
                                            className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 border border-slate-100 hover:border-blue-200 transition-all group"
                                        >
                                            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 line-clamp-2">
                                                {item.topic}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                                {item.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <Globe className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No trending topics available</p>
                                    <p className="text-xs mt-1">Make sure the agent is running</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Progress & Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Card */}
                        {isGenerating && progress && (
                            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                    Generating Your Story
                                </h3>

                                {/* Progress Steps */}
                                <div className="relative">
                                    <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-slate-200" />
                                    <div
                                        className="absolute left-7 top-4 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 transition-all duration-500"
                                        style={{ height: `${Math.max(0, (currentStage + 1) / PROGRESS_STAGES.length * 100)}%` }}
                                    />

                                    <div className="space-y-4">
                                        {PROGRESS_STAGES.map((stage, index) => {
                                            const Icon = stage.icon;
                                            const isActive = index === currentStage;
                                            const isComplete = index < currentStage;

                                            return (
                                                <div key={stage.key} className="flex items-center gap-4 relative">
                                                    <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${isComplete
                                                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30'
                                                        : isActive
                                                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 animate-pulse'
                                                            : 'bg-slate-100'
                                                        }`}>
                                                        {isComplete ? (
                                                            <CheckCircle2 className="h-6 w-6 text-white" />
                                                        ) : (
                                                            <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${isComplete || isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                                                            {stage.label}
                                                        </p>
                                                        {isActive && (
                                                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-2">
                                                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                                Processing...
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{progress.queriesCount}</p>
                                        <p className="text-xs text-slate-500 mt-1">Queries</p>
                                    </div>
                                    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-center">
                                        <p className="text-2xl font-bold text-purple-600">{progress.evidenceCount}</p>
                                        <p className="text-xs text-slate-500 mt-1">Sources Found</p>
                                    </div>
                                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
                                        <p className="text-2xl font-bold text-emerald-600">{progress.sectionsCount}</p>
                                        <p className="text-xs text-slate-500 mt-1">Sections</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Card */}
                        {error && (
                            <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-6 border border-red-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-red-800">Generation Failed</h3>
                                        <p className="text-sm text-red-600 mt-1">{error}</p>
                                        <button
                                            onClick={reset}
                                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
                                        >
                                            <RefreshCw className="h-4 w-4" /> Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Result Preview Card */}
                        {result && (
                            <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                {/* Preview Header */}
                                <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Story Generated Successfully!
                                    </h3>
                                    <button
                                        onClick={handleSendToEditor}
                                        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send to Editor
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Preview Content */}
                                <div className="p-6">
                                    {/* Title Section */}
                                    <div className="mb-6">
                                        <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">
                                            {result.category}
                                        </p>
                                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                                            {result.title}
                                        </h2>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            {result.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                            {result.mandal && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {result.mandal}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Just now
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="prose prose-slate prose-sm max-w-none">
                                        {result.content.blocks.slice(0, 5).map((block, index) => {
                                            if (block.type === 'heading') {
                                                const level = (block.data.level as number) || 2;
                                                if (level === 1) return <h1 key={index} className="text-slate-800">{block.data.text as string}</h1>;
                                                if (level === 2) return <h2 key={index} className="text-slate-800">{block.data.text as string}</h2>;
                                                return <h3 key={index} className="text-slate-800">{block.data.text as string}</h3>;
                                            }
                                            if (block.type === 'paragraph') {
                                                return <p key={index} className="text-slate-600">{block.data.text as string}</p>;
                                            }
                                            if (block.type === 'list') {
                                                return (
                                                    <ul key={index} className="text-slate-600">
                                                        {((block.data.items as string[]) || []).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                            return null;
                                        })}
                                        {result.content.blocks.length > 5 && (
                                            <p className="text-blue-600 text-sm font-medium">
                                                + {result.content.blocks.length - 5} more sections
                                            </p>
                                        )}
                                    </div>

                                    {/* Sources */}
                                    {result.sources && result.sources.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-blue-500" />
                                                Sources ({result.sources.length})
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {result.sources.slice(0, 4).map((source, index) => (
                                                    <a
                                                        key={index}
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors group"
                                                    >
                                                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                                                        <span className="text-sm text-slate-600 group-hover:text-blue-700 truncate flex-1">
                                                            {source.title}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Meta Info */}
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Keywords</p>
                                                <p className="text-slate-700">{result.metaTags.metaKeywords}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Slug</p>
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{result.slug}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isGenerating && !result && !error && (
                            <div className="rounded-2xl bg-white p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                                <div className="relative mx-auto w-24 h-24 mb-6">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 blur-xl" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                                        <Sparkles className="h-10 w-10 text-blue-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                    Ready to Create News Stories
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    Enter a news topic or select from trending topics, then click generate to create a professional news story with AI.
                                </p>
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Globe className="h-4 w-4" /> Live Web Research
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" /> CMS Compatible
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Zap className="h-4 w-4" /> Instant Generation
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
