"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Heading2, Paragraph, Caption } from "@rbxfolio/design-system";
import { Select } from "@rbxfolio/design-system";

type ContactRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

interface ContactRequest {
  id: string;
  visitorName: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  respondedAt: string | null;
  preferredContact?: string | null;
}

type FilterStatus = "ALL" | ContactRequestStatus;

/**
 * ContactRequestInbox Component
 *
 * Displays incoming contact requests with:
 * - List view with status indicators
 * - Status filtering
 * - Mark as accepted/declined
 * - Preferred contact display
 * - Message preview
 */
export function ContactRequestInbox() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch contact requests
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["contact-requests"],
    queryFn: async () => {
      const res = await fetch("/api/v1/users/me/contact-requests");
      if (!res.ok) throw new Error("Failed to load contact requests");
      return res.json() as Promise<ContactRequest[]>;
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: ContactRequestStatus;
    }) => {
      const res = await fetch(
        `/api/v1/users/me/contact-requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update request");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  if (isLoading) {
    return <Paragraph>Loading contact requests...</Paragraph>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <Caption className="text-red-700">Failed to load contact requests</Caption>
      </div>
    );
  }

  // Filter requests
  const filteredRequests =
    filterStatus === "ALL"
      ? requests || []
      : requests?.filter((r) => r.status === filterStatus) || [];

  const statusCounts = {
    ALL: requests?.length || 0,
    PENDING: requests?.filter((r) => r.status === "PENDING").length || 0,
    ACCEPTED: requests?.filter((r) => r.status === "ACCEPTED").length || 0,
    DECLINED: requests?.filter((r) => r.status === "DECLINED").length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <Heading2>Contact Requests</Heading2>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {statusCounts.PENDING}
          </span>
          {" new"}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["ALL", "PENDING", "ACCEPTED", "DECLINED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filterStatus === status
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {status === "ALL" ? "All" : status}
            <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-400" />
          <Heading2 className="mb-2">No requests</Heading2>
          <Paragraph className="text-gray-600">
            {filterStatus === "ALL"
              ? "You don't have any contact requests yet"
              : `No ${filterStatus.toLowerCase()} requests`}
          </Paragraph>
        </div>
      ) : (
        /* Requests List */
        <div className="space-y-3">
          <AnimatePresence>
            {filteredRequests.map((request) => (
              <ContactRequestCard
                key={request.id}
                request={request}
                isExpanded={expandedId === request.id}
                onToggleExpand={() =>
                  setExpandedId(
                    expandedId === request.id ? null : request.id
                  )
                }
                onAccept={() =>
                  updateStatusMutation.mutate({
                    requestId: request.id,
                    status: "ACCEPTED",
                  })
                }
                onDecline={() =>
                  updateStatusMutation.mutate({
                    requestId: request.id,
                    status: "DECLINED",
                  })
                }
                isUpdating={
                  updateStatusMutation.isPending &&
                  updateStatusMutation.variables?.requestId === request.id
                }
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface ContactRequestCardProps {
  request: ContactRequest;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isUpdating: boolean;
}

function ContactRequestCard({
  request,
  isExpanded,
  onToggleExpand,
  onAccept,
  onDecline,
  isUpdating,
}: ContactRequestCardProps) {
  const statusIcon = {
    PENDING: <Clock className="text-yellow-600" size={18} />,
    ACCEPTED: <CheckCircle2 className="text-green-600" size={18} />,
    DECLINED: <XCircle className="text-red-600" size={18} />,
  };

  const statusBgColor = {
    PENDING: "bg-yellow-50 border-yellow-200",
    ACCEPTED: "bg-green-50 border-green-200",
    DECLINED: "bg-red-50 border-red-200",
  };

  const statusTextColor = {
    PENDING: "text-yellow-800",
    ACCEPTED: "text-green-800",
    DECLINED: "text-red-800",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-lg transition-all ${statusBgColor[request.status]}`}
    >
      {/* Card Header */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 flex items-start justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
          {/* Status Icon */}
          <div className="mt-1">{statusIcon[request.status]}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {request.visitorName}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${statusTextColor[request.status]}`}
              >
                {request.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {request.message}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(request.createdAt).toLocaleDateString()}{" "}
              {new Date(request.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Expand Indicator */}
        <div className="ml-2">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-300 px-4 py-4 space-y-4"
          >
            {/* Full Message */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {request.message}
              </p>
            </div>

            {/* Preferred Contact */}
            {request.status === "ACCEPTED" && request.preferredContact && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-medium text-blue-900">
                      Preferred Contact Method
                    </p>
                    <p className="text-sm text-blue-800 break-all">
                      {request.preferredContact}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Timeline</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  Received:{" "}
                  {new Date(request.createdAt).toLocaleString()}
                </div>
                {request.respondedAt && (
                  <div>
                    Responded:{" "}
                    {new Date(request.respondedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {request.status === "PENDING" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onAccept}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                >
                  ✓ Accept
                </button>
                <button
                  onClick={onDecline}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                >
                  ✕ Decline
                </button>
              </div>
            )}

            {request.status === "ACCEPTED" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-900">
                  ✓ You accepted this collaboration request
                </p>
              </div>
            )}

            {request.status === "DECLINED" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-900">
                  ✕ You declined this request
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
