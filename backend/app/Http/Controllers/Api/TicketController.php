<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\TicketMessage;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role === 'admin' || $request->user()->role === 'developer') {
            return response()->json(Ticket::with('user')->latest()->get());
        }
        return response()->json($request->user()->tickets()->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'subject' => strip_tags($validated['subject']),
            'status' => 'open',
        ]);

        $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => clean($validated['message']),
            'is_admin' => false,
        ]);

        return response()->json($ticket->load('messages'), 201);
    }

    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load(['user', 'messages.user']));
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $isAdmin = in_array($request->user()->role, ['admin', 'developer', 'finance', 'stock_agent']);

        $message = $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => clean($validated['message']),
            'is_admin' => $isAdmin,
        ]);

        if ($isAdmin) {
            $ticket->update(['status' => 'answered']);
        } else {
            $ticket->update(['status' => 'open']);
        }

        return response()->json($message->load('user'), 201);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,answered,resolved,closed',
        ]);

        $ticket->update($validated);

        return response()->json($ticket);
    }
}
