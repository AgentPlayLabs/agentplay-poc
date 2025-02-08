import type { UUID } from "@elizaos/core";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

export default function Page({ agentId }: { agentId: UUID }) {
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000,
    });

    const agents = query?.data?.agents;

    const [input, setInput] = useState("");
    const [agentName2, setAgentName2] = useState("");
    const [agentId2, setAgentId2] = useState("");
    const agentName = agents?.find((agent: { id: UUID; name: string }) => agent.id === agentId)?.name;

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <h1 className="mt-2.5">Discuss Preparation</h1>
            <div className="mt-2.5">
                Discuss Topic: {input}
                <Input
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    placeholder="Please type discuss topic..."
                    className="mt-1.5 min-h-12 resize-none rounded-md bg-card border-0 p-3 shadow-none focus-visible:ring-0"
                />
            </div>
            <div className="mt-2.5">
                <h3 className=""> Agent: {agentName} </h3>
            </div>
            <div className="mt-2.5 mb-1.5">
                <h3 className=""> Agent: {agentName2} </h3>
            </div>
            <Select.Root onValueChange={(value) => {
                setAgentId2(value);
                const selectedAgent = agents?.find((agent: { id: UUID; name: string }) => agent.id === value);
                setAgentName2(selectedAgent?.name || "");
            }}>
                <Select.Trigger className="inline-flex items-center justify-between rounded px-4 py-2 text-sm leading-none gap-1 bg-white/5 hover:bg-white/10">
                    <Select.Value placeholder="Select an agent..." />
                    <Select.Icon>
                        <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content className="overflow-hidden bg-gray-800 rounded-md shadow-lg border border-gray-700" >
                        <Select.ScrollUpButton />
                        <Select.Viewport className="p-2">
                            <Select.Group>
                                <Select.Label className="px-6 text-sm text-gray-300">Agents</Select.Label>
                                {agents?.filter((agent: { id: UUID; name: string }) => agent.id !== agentId).map((agent: { id: UUID; name: string }) => (
                                    <Select.Item
                                        key={agent.id}
                                        value={agent.id}
                                        className="relative flex items-center px-6 py-2 text-sm text-white rounded-sm hover:bg-gray-700 focus:bg-gray-700 radix-disabled:opacity-50"
                                    >
                                        <Select.ItemText>{agent.name}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                    </Select.Content>
                </Select.Portal>
            </Select.Root>

            <div className="mt-2.5">
                <NavLink
                    to={`/discuss/${agentId}/${agentId2}/${input}`}
                    className="w-full grow"
                >
                    <Button
                        variant="outline"
                        className="w-full grow"
                    >
                        Start
                    </Button>
                </NavLink>
            </div>
        </div>
    );
}
